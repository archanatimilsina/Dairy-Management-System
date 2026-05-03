from django.urls import path
from .views import ProductListCreateView, ProductDetailView,CartDetailView,CartListCreateView
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('listCreate/', ProductListCreateView.as_view(), name="ProductListCreate"),
    path('detail/<int:pk>/', ProductDetailView.as_view(), name="ProductDetailView"),
    path('cart/listCreate/', CartListCreateView.as_view(), name="CartListCreate"),
    path('cart/detail/<int:pk>/', CartDetailView.as_view(), name="CartDetailView"),  
]
