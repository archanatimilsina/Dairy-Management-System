from rest_framework.views import APIView
from .models import Product, Cart
from rest_framework import generics
from .serializers import ProductSerializer, CartSerializer



class ProductListCreateView(generics.ListCreateAPIView):
   queryset= Product.objects.all()
   serializer_class = ProductSerializer



class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
   queryset= Product.objects.all()
   serializer_class = ProductSerializer



class CartListCreateView(generics.ListCreateAPIView):
   queryset = Cart.objects.all()
   serializer_class = CartSerializer
   def perform_create(self, serializer):
      serializer.save(user= self.request.user)

class CartDetailView(generics.RetrieveUpdateDestroyAPIView):
   queryset = Cart.objects.all()
   serializer_class = CartSerializer
   

