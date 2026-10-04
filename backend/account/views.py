from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from order.serializers import OrderSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from order.models import Order
from .serializers import (
   RegisterSerializer, UserSerializer, CompanyConfigurationSerializer
)
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from .services import send_custom_mail
from rest_framework import generics
from .models import CompanyConfiguration

class RegisterView(APIView):
    # No JWT parsing here: DRF authenticates before checking permissions, so an
    # expired/garbage Authorization header would otherwise turn every signup
    # attempt into a 401 `token_not_valid`.
    authentication_classes = []

    def post(self, request):
       serializer = RegisterSerializer(data= request.data)
       if serializer.is_valid():
         user= serializer.save()       
         refresh = RefreshToken.for_user(user)
         return Response({
         'user': serializer.data,
        'access': str(refresh.access_token),
        'refresh': str(refresh),
         },status=status.HTTP_201_CREATED)
       
       else:
          print(serializer.errors)
          return Response(data= serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    # Same reason as RegisterView: a dead token must not be able to lock the
    # user out of the login endpoint itself.
    authentication_classes = []

    def post(self, request):
       identifier= (request.data.get('emailOrUsername') or '').strip()
       password= request.data.get('password')
       if not identifier or not password:
            return Response({"error": "Both identifier and password are required"}, status=status.HTTP_400_BAD_REQUEST)

       # One query for the user, one password verification.
       #
       # The old version ran User.objects.get(email__iexact=...) and then handed
       # the username to authenticate(), which fetched the very same row a
       # second time. That doubled the DB round trips on the hottest endpoint.
       user = None
       if "@" in identifier:
            user = (User.objects
                    .select_related('profile')
                    .filter(email__iexact=identifier)
                    .order_by('id')
                    .first())
       else:
            user = (User.objects
                    .select_related('profile')
                    .filter(username=identifier)
                    .first())

       # is_active mirrors ModelBackend.user_can_authenticate, so deactivated
       # accounts keep failing exactly as before. last_login is deliberately not
       # touched: this API never calls django.contrib.auth.login(), so Django 6
       # never fired the user_logged_in signal here either.
       if user is not None and user.is_active and user.check_password(password):
           refresh= RefreshToken.for_user(user)
           return Response({
              'user':{
                 'id':user.id,
                 'username':user.username,
                 'email': user.email
                    },
              'access':str(refresh.access_token),
              'refresh':str(refresh)
           }, status=status.HTTP_200_OK,
           )
       else:
           return Response(
                {"error": "Invalid username or password"},
                status=status.HTTP_401_UNAUTHORIZED
            )
          

class LogoutView(APIView):
  authentication_classes = []

  def post(self, request):
     try: 
        refresh= request.data.get('refresh_token')
        if not refresh:
           return Response({"error":"refresh_token is required"}, status=status.HTTP_400_BAD_REQUEST)
        token = RefreshToken(refresh)
        token.blacklist()
        return Response({"msg":"Successfully logged out"}, status=status.HTTP_205_RESET_CONTENT)
        return 
     except Exception as e:
        return Response({"error":"Invalid token or already logged out"}, status=status.HTTP_400_BAD_REQUEST)



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
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)
      except (TypeError, ValueError, OverflowError, User.DoesNotExist):
       return Response({"error": "Invalid request parameters."}, status=status.HTTP_400_BAD_REQUEST)

   


class UserListView(generics.ListAPIView):
   queryset = User.objects.select_related('profile').all()
   serializer_class = UserSerializer
   permission_classes = [IsAuthenticated]



class UserDetailByUsernameView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    lookup_field = 'username'
    queryset = User.objects.select_related('profile').all()
    permission_classes = [IsAuthenticated]

   
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
    permission_classes = [IsAuthenticated]

    def post(self, request):
        to_data = request.data.get('to')
        subject = request.data.get('subject')
        message = request.data.get('message')
        attachment = request.FILES.get('attachment')
        if isinstance(to_data, str):
            recipient_list = [to_data]
        else:
            recipient_list = to_data or []

        if not recipient_list:
            return Response({"success": False, "error": "Recipient list is empty"}, status=400)

        try:
            for email in recipient_list:
                context = {
                    'subject': subject,
                    'content': message,
                    'username': email.split('@')[0],
                    'attachment': attachment
                }
                send_custom_mail(
                    subject, 
                    email, 
                    'generalEmailFormat.html', 
                    context
                )
            return Response({
                "success": True, 
                "message": f"Successfully sent to {len(recipient_list)} recipient(s)."
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
        return [IsAuthenticated()]

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
        user_email = request.user.email
        queryset = Order.objects.filter(email=user_email)
        
        serializer = OrderSerializer(queryset, many=True)
        return Response({
            "success": True,
            "data": serializer.data
        })