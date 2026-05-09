from rest_framework import serializers
from .models import Product, Cart, Category

class CategorySerializer(serializers.ModelSerializer):
   class Meta:
      model = Category
      fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
   unit = serializers.ReadOnlyField(source='category.unit')
   category_name = serializers.ReadOnlyField(source='category.name')
   class Meta:
      model = Product
      fields = ['id', 'product_name', 'category', 'category_name', 'unit', 'price', 'picture_src']

    
class CartSerializer(serializers.ModelSerializer):
   user = serializers.ReadOnlyField(source = 'user.username')
   product_name = serializers.ReadOnlyField(source = 'product.product_name')
   category = serializers.ReadOnlyField(source = 'product.category.name')
   price = serializers.ReadOnlyField(source = 'product.price')
   unit = serializers.ReadOnlyField(source = 'product.category.unit')
   picture_src = serializers.ImageField(source = 'product.picture_src',read_only=True)

   class Meta:
      model = Cart
      fields = ['id', 'user', 'product', 'quantity', 'added_at','product_name','category','price','unit','picture_src']


      