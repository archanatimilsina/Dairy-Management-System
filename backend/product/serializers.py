from rest_framework import serializers
from .models import Product, Cart
class ProductSerializer(serializers.ModelSerializer):
   class Meta:
      model = Product
      fields = '__all__'


    
class CartSerializer(serializers.ModelSerializer):
   user = serializers.ReadOnlyField(source = 'user.username')

   class Meta:
      model = Cart
      fields = ['id', 'user', 'product', 'quantity', 'added_at']