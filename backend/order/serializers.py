from rest_framework import serializers
from .models import OrderItem,Order


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model= OrderItem
        fields = ['product', 'product_name','quantity', 'unit', 'price_at_purchase', 'subtotal']
        

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many = True)
    class Meta:
        model = Order
        fields = ['id','full_name', 'email', 'contact_number','total_amount','delivery_fee', 'delivery_status','location','order_type','admin_note','items','order_status']
        read_only_fields = ['id', 'created_at', 'updated_at']
    def create(self, validated_data):
        item_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item in item_data:
            OrderItem.objects.create(order = order, **item)
        return order