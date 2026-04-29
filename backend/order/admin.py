from django.contrib import admin
from .models import Order
from .models import OrderItem

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display=('id','full_name','email','contact_number','total_amount','products','delivery_status','admin_note','order_type','order_by','location')


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display=('id','order','product','quantity','product_name','unit','price_at_purchase')



