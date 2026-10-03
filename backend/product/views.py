from rest_framework.views import APIView
from .models import Product, Cart, Category
from rest_framework import generics
from .serializers import ProductSerializer, CartSerializer, CategorySerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated


class ProductPagination(PageNumberPagination):
   page_size = 20
   page_size_query_param = 'page_size'
   max_page_size = 100


class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.select_related('category').all()
    serializer_class = ProductSerializer
    pagination_class = ProductPagination

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.select_related('category').all()
    serializer_class = ProductSerializer


class CartListCreateView(generics.ListCreateAPIView):
   serializer_class = CartSerializer
   permission_classes = [IsAuthenticated]

   def get_queryset(self):
      return (Cart.objects
              .filter(user=self.request.user)
              .select_related('product', 'product__category', 'user'))

   def perform_create(self, serializer):
      serializer.save(user=self.request.user)

class CartDetailView(generics.RetrieveUpdateDestroyAPIView):
   serializer_class = CartSerializer
   permission_classes = [IsAuthenticated]

   def get_queryset(self):
      return (Cart.objects
              .filter(user=self.request.user)
              .select_related('product', 'product__category', 'user'))
   

class CategoryListCreateView(generics.ListCreateAPIView):
   queryset = Category.objects.all()
   serializer_class = CategorySerializer

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
   queryset = Category.objects.all()
   serializer_class = CategorySerializer