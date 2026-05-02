from django.urls import path
from .views import ProductListCreateView, ProductDetailView,CartDetailView,CartListCreateView
urlpatterns = [
    path('listCreate/', ProductListCreateView.as_view(), name="ProductListCreate"),
    path('detail/<int:id>/', ProductDetailView.as_view(), name="ProductDetailView"),
    path('cart/listCreate/', CartListCreateView.as_view(), name="ProductListCreate"),
    path('cart/detail/<int:id>/', CartDetailView.as_view(), name="ProductDetailView"),
    
]
