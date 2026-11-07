from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from order.serializers import OrderSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from order.models import Order
from .serializers import (
   RegisterSerializer, UserSerializer, UserMeSerializer, CompanyConfigurationSerializer
)
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from .services import send_custom_mail
from rest_framework import generics
from .models import CompanyConfiguration
import logging
from django.db import (
    DatabaseError, IntegrityError, OperationalError, ProgrammingError, transaction
)

logger = logging.getLogger(__name__)


def _database_error_response(exc, operation):
    """Turn a database exception into a JSON response the frontend can show.

    Not all DatabaseError subclasses mean the same thing:
      * OperationalError -> the database is unreachable/down; retrying later
        is exactly the right user action.
      * ProgrammingError -> the schema is wrong (a table/column is missing,
        i.e. migrations were never applied). Retrying forever cannot help,
        and calling this "temporarily unavailable" hides a deploy problem.
    """
    if isinstance(exc, ProgrammingError):
        logger.exception("%s: database schema error (pending migrations?)", operation)
        return Response(
            {
                "error": "Database schema is out of date. An administrator must run migrations.",
                "code": "db_schema_out_of_date",
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )
    if isinstance(exc, OperationalError):
        logger.exception("%s: database unavailable", operation)
        return Response(
            {
                "error": "Database temporarily unavailable. Please try again in a minute.",
                "code": "db_unavailable",
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )
    logger.exception("%s: database error", operation)
    return Response(
        {
            "error": "Database error. Please try again in a minute.",
            "code": "db_error",
        },
        status=status.HTTP_503_SERVICE_UNAVAILABLE,
    )


class RegisterView(APIView):
    # No JWT parsing here: DRF authenticates before checking permissions, so an
    # expired/garbage Authorization header would otherwise turn every signup
    # attempt into a 401 `token_not_valid`.
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        # Every failure path below returns JSON. Letting a database exception
        # escape would produce Django's bare HTML "Server Error (500)" page,
        # which the frontend cannot parse.
        try:
            serializer = RegisterSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            try:
                # Mint the refresh token inside the same transaction as the
                # user/profile writes: OutstandingToken.objects.create() runs
                # inside for_user(), so if the token_blacklist tables are
                # missing (migrations not applied) the user row rolls back too
                # and a retry after migrating succeeds instead of wrongly
                # reporting "already exists".
                with transaction.atomic():
                    user = serializer.save()
                    refresh = RefreshToken.for_user(user)
            except IntegrityError:
                # Race: two simultaneous signups pass validation, then one
                # hits the DB unique constraint. 400, not 500.
                return Response(
                    {"username": ["A user with these credentials already exists."]},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except DatabaseError as exc:
            return _database_error_response(exc, "register")
        except Exception:
            logger.exception("register failed")
            return Response(
                {"error": "Server error while creating your account. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response({
            'user': serializer.data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    # Same reason as RegisterView: a dead token must not be able to lock the
    # user out of the login endpoint itself.
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        # All DB/token failures return JSON (503/500), never Django's HTML
        # 500 page, so the frontend can show a real message.
        try:
            identifier = (request.data.get('emailOrUsername') or '').strip()
            password = request.data.get('password')
            if not identifier or not password:
                return Response({"error": "Both identifier and password are required"}, status=status.HTTP_400_BAD_REQUEST)

            # One indexed query for the user, one password verification.
            # No select_related('profile'): the login response never uses the
            # profile, so the JOIN is pure waste. .only() keeps the row small on
            # the Render -> Supabase WAN link.
            user = None
            if "@" in identifier:
                user = (User.objects
                        .filter(email__iexact=identifier)
                        .only('id', 'username', 'email', 'password', 'is_active', 'is_staff')
                        .order_by('id')
                        .first())
            else:
                user = (User.objects
                        .filter(username=identifier)
                        .only('id', 'username', 'email', 'password', 'is_active', 'is_staff')
                        .first())

            # is_active mirrors ModelBackend.user_can_authenticate, so deactivated
            # accounts keep failing exactly as before.
            if user is not None and user.is_active and user.check_password(password):
                # OutstandingToken.objects.create() runs inside for_user(): a
                # missing token_blacklist migration must come back as JSON.
                refresh = RefreshToken.for_user(user)
                return Response({
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'is_staff': user.is_staff,
                    },
                    'access': str(refresh.access_token),
                    'refresh': str(refresh)
                }, status=status.HTTP_200_OK)
            return Response(
                {"error": "Invalid username or password"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except DatabaseError as exc:
            return _database_error_response(exc, "login")
        except Exception:
            logger.exception("login failed")
            return Response(
                {"error": "Server error while signing in. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
          

class LogoutView(APIView):
  authentication_classes = []

  def post(self, request):
      refresh = request.data.get('refresh_token') or request.data.get('refresh')
      if not refresh:
         return Response({"error": "refresh_token is required"}, status=status.HTTP_400_BAD_REQUEST)
      try:
         token = RefreshToken(refresh)
         token.blacklist()
         return Response({"msg": "Successfully logged out"}, status=status.HTTP_200_OK)
      except Exception:
         return Response({"error": "Invalid token or already logged out"}, status=status.HTTP_400_BAD_REQUEST)



class PasswordResetView(APIView):
  authentication_classes = []

  def post(self, request):
        email= request.data.get("email")
        if not email:
            return Response({"message":"If this email exists, a link has been sent"},status=status.HTTP_200_OK)
        try:
           user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response({"message":"If this email exists, a link has been sent"},status=status.HTTP_200_OK)
        except User.MultipleObjectsReturned:
            return Response({"message":"If this email exists, a link has been sent"},status=status.HTTP_200_OK)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_link=f"{settings.FRONTEND_URL.rstrip('/')}/reset-password/{uid}/{token}"
        success= send_custom_mail(
           subject="Reset your Password",
           recipient_email= user.email,
           template_name='resetPassword.html',
           context={
              'username': user.username,
              'content': "Click the following link to reset your password",
              'reset_link':reset_link
           }

        )
        if success:
            return Response({"message":"Reset link is sent to your email"}, status=status.HTTP_200_OK)
        return Response({"error":"Email failed to send"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class PasswordResetConfirmView(APIView):
    authentication_classes = []

    def post(self,request,uidb64, token):
      try:
        uid= urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
        if default_token_generator.check_token(user,token):
            new_password= request.data.get('password')
            if not new_password:
               return Response({"error": "Password is required."}, status=status.HTTP_400_BAD_REQUEST)
            from django.contrib.auth.password_validation import validate_password
            from django.core.exceptions import ValidationError as DjangoValidationError
            try:
                validate_password(new_password, user)
            except DjangoValidationError as e:
                return Response({"error": list(e.messages)}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(new_password)
            user.save()
            # Revoke outstanding JWTs so old sessions cannot survive a reset.
            try:
                from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
                for t in OutstandingToken.objects.filter(user=user):
                    BlacklistedToken.objects.get_or_create(token=t)
            except Exception:
                pass
            return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)
      except (TypeError, ValueError, OverflowError, User.DoesNotExist):
       return Response({"error": "Invalid request parameters."}, status=status.HTTP_400_BAD_REQUEST)

   


class UserListView(generics.ListAPIView):
   queryset = User.objects.select_related('profile').all()
   serializer_class = UserSerializer
   permission_classes = [IsAdminUser]



class UserDetailByUsernameView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    lookup_field = 'username'
    queryset = User.objects.select_related('profile').all()
    permission_classes = [IsAdminUser]


class UserMeView(generics.RetrieveUpdateAPIView):
    """Authenticated self-service profile.

    GET /user/me/ — any logged-in user reads their own record.
    PATCH /user/me/ — user may update first_name, last_name, contact,
    user_type only. username/email/staff flags are read-only so
    privilege escalation is impossible.
    """
    serializer_class = UserMeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return User.objects.select_related('profile').get(pk=self.request.user.pk)

   
# class SendDirectMailView(APIView):
#    def post(self, request):
#       to_email = request.data.get('to')
#       subject = request.data.get('subject')
#       message = request.data.get('message')
#       attachment = request.FILES.get('attachment')

#       context ={
#          'subject': subject,
#           'content': message,
#           'username': to_email.split('@')[0],
#           'attachment' : attachment
#                      }
#       success = send_custom_mail(subject,to_email,'generalEmailFormat.html',context)


class SendDirectMailView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        to_data = request.data.get('to')
        subject = (request.data.get('subject') or '').strip()
        message = request.data.get('message') or ''
        attachment = request.FILES.get('attachment')
        if isinstance(to_data, str):
            recipient_list = [to_data]
        else:
            recipient_list = list(to_data) if to_data else []

        if not recipient_list:
            return Response({"success": False, "error": "Recipient list is empty"}, status=400)
        if len(recipient_list) > 50:
            return Response({"success": False, "error": "Too many recipients (max 50)."}, status=400)
        if not subject or not str(message).strip():
            return Response({"success": False, "error": "Subject and message are required."}, status=400)
        if '\n' in subject or '\r' in subject:
            return Response({"success": False, "error": "Invalid subject."}, status=400)
        if attachment and attachment.size > 5 * 1024 * 1024:
            return Response({"success": False, "error": "Attachment too large (max 5MB)."}, status=400)

        try:
            sent = 0
            for email in recipient_list:
                if not isinstance(email, str) or '@' not in email or '\n' in email or '\r' in email:
                    continue
                if attachment:
                    try:
                        attachment.seek(0)
                    except Exception:
                        pass
                context = {
                    'subject': subject,
                    'content': message,
                    'username': email.split('@')[0],
                    'attachment': attachment,
                }
                if send_custom_mail(subject, email, 'generalEmailFormat.html', context, attachment=attachment):
                    sent += 1
            return Response({
                "success": True,
                "message": f"Successfully sent to {sent} recipient(s)."
            })
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=500)




class CompanyConfigurationView(APIView):  

    def get_permissions(self):
        # Read is public (footer / home page render it for signed-out visitors),
        # writes are admin-only. This has to be resolved per request --
        # assigning to self.permission_classes inside get() runs *after*
        # DRF has already evaluated the permissions.
        if self.request.method in ('GET', 'HEAD', 'OPTIONS'):
            return [AllowAny()]
        return [IsAdminUser()]

    def get_object(self):
        obj, created = CompanyConfiguration.objects.get_or_create(pk=1)
        return obj

    def get(self, request):
        instance = self.get_object()
        serializer = CompanyConfigurationSerializer(instance)
        return Response({"success": True, "data": serializer.data})

    def patch(self, request):
        instance = self.get_object()
        serializer = CompanyConfigurationSerializer(instance, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "data": serializer.data})
        
        return Response({
            "success": False, 
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    



class UserOrderHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from django.db.models import Q
        user = request.user
        filt = Q(user=user)
        if getattr(user, 'email', None):
            filt |= Q(email__iexact=user.email)
        queryset = Order.objects.filter(filt).prefetch_related('items', 'items__product').order_by('-created_at')
        
        serializer = OrderSerializer(queryset, many=True)
        return Response({
            "success": True,
            "data": serializer.data
        })