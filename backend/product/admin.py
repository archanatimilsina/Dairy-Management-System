from django.contrib import admin
from .models import Product, Cart, Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name','unit')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display=('id', 'product_name','category','price','picture_src','description','get_unit','stock')
    def get_unit(self, obj):
        return obj.category.unit
    

    
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display=('id','product','user','added_at')


