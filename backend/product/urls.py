from django.urls import path
from .views import ProductListCreateView, ProductDetailView
urlpatterns = [
    path('listCreate/', ProductListCreateView.as_view(), name="ProductListCreate"),
    path('detail/<int:id>/', ProductDetailView.as_view(), name="ProductDetailView"),
    
]
