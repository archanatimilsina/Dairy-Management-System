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

    def get_permissions(self):
        # Public catalog reads; writes are admin-only. Fail-closed.
        from rest_framework.permissions import AllowAny, IsAdminUser
        if self.request.method in ('GET', 'HEAD', 'OPTIONS'):
            return [AllowAny()]
        return [IsAdminUser()]

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.select_related('category').all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        from rest_framework.permissions import AllowAny, IsAdminUser
        if self.request.method in ('GET', 'HEAD', 'OPTIONS'):
            return [AllowAny()]
        return [IsAdminUser()]


class CartListCreateView(generics.ListCreateAPIView):
   serializer_class = CartSerializer
   permission_classes = [IsAuthenticated]

   def get_queryset(self):
      return (Cart.objects
              .filter(user=self.request.user)
              .select_related('product', 'product__category', 'user'))

   def perform_create(self, serializer):
      # Merge duplicates instead of creating parallel rows.
      product = serializer.validated_data.get('product')
      quantity = serializer.validated_data.get('quantity') or 1
      if quantity < 1:
          quantity = 1
      existing = Cart.objects.filter(user=self.request.user, product=product).first()
      if existing:
          existing.quantity = (existing.quantity or 0) + quantity
          existing.save(update_fields=['quantity'])
          serializer.instance = existing
          return
      serializer.save(user=self.request.user, quantity=quantity)

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

   def get_permissions(self):
       from rest_framework.permissions import AllowAny, IsAdminUser
       if self.request.method in ('GET', 'HEAD', 'OPTIONS'):
           return [AllowAny()]
       return [IsAdminUser()]

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
   queryset = Category.objects.all()
   serializer_class = CategorySerializer

   def get_permissions(self):
       from rest_framework.permissions import AllowAny, IsAdminUser
       if self.request.method in ('GET', 'HEAD', 'OPTIONS'):
           return [AllowAny()]
       return [IsAdminUser()]