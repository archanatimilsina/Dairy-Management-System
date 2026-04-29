from django.shortcuts import render
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import (
   RegisterSerializer
)
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from .services import send_custom_mail



class RegisterView(APIView):
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
    def post(self, request):
       identifier= request.data.get('emailOrUsername')
       password= request.data.get('password')
       if not identifier or not password:
            return Response({"error": "Both identifier and password are required"}, status=status.HTTP_400_BAD_REQUEST)
       if "@" in identifier:
            try:
                user_obj = User.objects.get(email=identifier)
                username = user_obj.username
            except User.DoesNotExist:
                return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
       else:
            username = identifier
       user = authenticate(username=username, password= password)
       if user is not None:
          Refresh= RefreshToken.for_user(user)
          return Response({
             'user':{
                'id':user.id,
                'username':user.username,
                'email': user.email
                    },
             'access':str(Refresh.access_token),
             'refresh':str(Refresh)
          }, status=status.HTTP_200_OK, 
          )
       else:
          return Response(
                {"error": "Invalid username or password"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
          

class LogoutView(APIView):
  def post(self, request):
     try: 
        refresh= request.data.refresh_token
        token = RefreshToken(refresh)
        token.blacklist()
        return Response({"msg":"Successfully logged out"}, status=status.HTTP_205_RESET_CONTENT)
        return 
     except Exception as e:
        return Response({"error":"Invalid token or already logged out"}, status=status.HTTP_400_BAD_REQUEST)



class PasswordResetView(APIView):
  def post(self, request):
        email= request.data.get("email")
        try:
           user = User.objects.get(email=email)
           uid = urlsafe_base64_encode(force_bytes(user.pk))
           token = default_token_generator.make_token(user)
           reset_link=f"http://localhost:5173/reset-password/{uid}/{token}"
           success= send_custom_mail(
              subject="Reset your Password",
              recipient_email= user.email,
              template_name='emailFormat.html',
              context={
                 'username': user.username,
                 'content': "Click the following link to reset your password",
                 'reset_link':reset_link
              }

           )
           if success:
               return Response({"message":"Reset link is sent to your email"}, status=status.HTTP_200_OK)
           return Response({"error":"Email failed to send"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except User.DoesNotExist:
           return Response({"message":"If this email exists, a link has been sent"},status=status.HTTP_200_OK)
        

class PasswordResetConfirmView(APIView):
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

   
