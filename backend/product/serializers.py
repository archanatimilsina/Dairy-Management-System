from rest_framework import serializers
from .models import Product, Cart
class ProductSerializer(serializers.ModelSerializer):
   class Meta:
      model = Product
      fields = '__all__'


    
class CartSerializer(serializers.ModelSerializer):
   user = serializers.ReadOnlyField(source = 'user.username')
   product_name = serializers.ReadOnlyField(source = 'product.product_name')
   category = serializers.ReadOnlyField(source = 'product.category')
   price = serializers.ReadOnlyField(source = 'product.price')
   unit = serializers.ReadOnlyField(source = 'product.unit')
   picture_src = serializers.ImageField(source = 'product.picture_src',read_only=True)

   class Meta:
      model = Cart
      fields = ['id', 'user', 'product', 'quantity', 'added_at','product_name','category','price','unit','picture_src']

      
