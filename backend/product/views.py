from rest_framework.views import APIView
from .models import Product, Cart, Category
from rest_framework import generics
from .serializers import ProductSerializer, CartSerializer, CategorySerializer
from rest_framework.pagination import PageNumberPagination
from supabase import create_client
import os
import uuid

supabase = create_client(
    os.environ.get('SUPABASE_URL'),
    os.environ.get('SUPABASE_KEY')
)

class ProductPagination(PageNumberPagination):
   page_size= 20
   page_sixe_query_param = 'page_size'
   max_page_size = '100'
   


class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = ProductPagination

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        
        image_file = request.FILES.get('picture_src')
        if image_file:
            ext = image_file.name.split('.')[-1]
            filename = f"products/{uuid.uuid4()}.{ext}"
            file_bytes = image_file.read()
            
            supabase.storage.from_('media').upload(
                path=filename,
                file=file_bytes,
                file_options={"content-type": image_file.content_type}
            )
            
            public_url = supabase.storage.from_('media').get_public_url(filename)
            data['picture_src'] = public_url

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def update(self, request, *args, **kwargs):
        data = request.data.copy()
        
        image_file = request.FILES.get('picture_src')
        if image_file:
            ext = image_file.name.split('.')[-1]
            filename = f"products/{uuid.uuid4()}.{ext}"
            file_bytes = image_file.read()
            
            supabase.storage.from_('media').upload(
                path=filename,
                file=file_bytes,
                file_options={"content-type": image_file.content_type}
            )
            
            public_url = supabase.storage.from_('media').get_public_url(filename)
            data['picture_src'] = public_url

        serializer = self.get_serializer(
            self.get_object(), 
            data=data, 
            partial=kwargs.pop('partial', False)
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class CartListCreateView(generics.ListCreateAPIView):
   queryset = Cart.objects.all()
   serializer_class = CartSerializer
   def perform_create(self, serializer):
      serializer.save(user= self.request.user)

class CartDetailView(generics.RetrieveUpdateDestroyAPIView):
   queryset = Cart.objects.all()
   serializer_class = CartSerializer
   

class CategoryListCreateView(generics.ListCreateAPIView):
   queryset = Category.objects.all()
   serializer_class = CategorySerializer

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
   queryset = Category.objects.all()
   serializer_class = CategorySerializer