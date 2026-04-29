
from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import ( 
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    PasswordResetView,
    PasswordResetConfirmView
)
urlpatterns = [
    path('api/token/',TokenObtainPairView.as_view(),name="token_obtain_pair"),
    path('api/token/refresh',TokenRefreshView.as_view(),name="token_refresh"),
    path('register/',RegisterView.as_view(),name="register"),
    path('login/',LoginView.as_view(),name = "login"),
    path('logout/',LogoutView.as_view(),name = "logout"),
    path('forgot-password/', PasswordResetView.as_view(), name='forgot_password'),
    path('reset-password-confirm/<str:uidb64>/<str:token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]
