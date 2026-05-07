from rest_framework.views import APIView
from .models import Product, Cart
from rest_framework import generics, pagination
from .serializers import ProductSerializer, CartSerializer
from rest_framework.pagination import PageNumberPagination


class ProductPagination(PageNumberPagination):
   page_size= 20
   page_sixe_query_param = 'page_size'
   max_page_size = '100'
   


class ProductListCreateView(generics.ListCreateAPIView):
   queryset= Product.objects.all()
   serializer_class = ProductSerializer
   pagination_class = ProductPagination


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
   

