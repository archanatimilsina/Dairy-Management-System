
from django.contrib import admin
from django.urls import path,include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('account.urls')),
    path('product/',include('product.urls')),
    path('contact/',include('contact.urls')),
    path('feedback/',include('Feedbacks.urls')),
    path('order/',include('order.urls'))
]
