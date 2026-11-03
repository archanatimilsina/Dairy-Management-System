
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.views.static import serve
from core.views import HealthView

urlpatterns = [
    path('health/',HealthView.as_view(),name="health"),
    path('admin/', admin.site.urls),
    path('',include('account.urls')),
    path('product/',include('product.urls')),
    path('contact/',include('contact.urls')),
    path('feedback/',include('Feedbacks.urls')),
    path('order/',include('order.urls')),
    # Serve uploaded product images in every env (dev AND prod). Django's
    # static() helper is a no-op when DEBUG=0, which is why /media/* 404'd
    # on Render. NOTE: Render's disk is ephemeral — uploads vanish on
    # redeploy. For permanent storage attach a Render Disk or move to S3.
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]