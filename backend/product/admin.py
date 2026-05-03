from django.contrib import admin
from .models import Product, Cart


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display=('id', 'product_name','category','price','picture_src','description','unit','stock')

    
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display=('id','product','user','added_at')