from django.contrib import admin
from .models import Order
from .models import OrderItem


# @admin.register(OrderItem)
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra =0
    readonly_fields =['subtotal']
    list_display=('id','order','product','quantity','product_name','unit','price_at_purchase','get_fullname')

    def get_fullname(self, obj):
       return obj.order.full_name
    get_fullname.short_description = 'full_name'



@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display=('id','full_name','email','contact_number','total_amount','delivery_status','admin_note','order_type','location','order_status')
    inlines = [OrderItemInline]



