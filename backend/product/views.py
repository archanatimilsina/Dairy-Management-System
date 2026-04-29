from rest_framework.views import APIView
from .models import Product
from rest_framework import generics
from .serializers import ProductSerializer



class ProductListCreateView(generics.ListCreateAPIView):
   queryset= Product.objects.all()
   serializer_class = ProductSerializer



class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
   queryset= Product.objects.all()
   serializer_class = ProductSerializer





