from django.db import transaction
from rest_framework import serializers
from .models import OrderItem,Order


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model= OrderItem
        fields = ['product', 'product_name','quantity', 'unit', 'price_at_purchase', 'subtotal']
        

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many = True, read_only=True)
    class Meta:
        model = Order
        fields = ['id','full_name', 'email', 'contact_number','total_amount','delivery_fee', 'delivery_status','location','order_type','admin_note','items','order_status','created_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    @transaction.atomic
    def create(self, validated_data):
        items_data = self.initial_data.get('items') or []
        order = Order.objects.create(**validated_data)
        model_fields = {f.name for f in OrderItem._meta.get_fields()}
        for raw_item in items_data:
            if not isinstance(raw_item, dict):
                continue
            item = {k: v for k, v in raw_item.items()
                    if k in model_fields and k != 'order' and v is not None}
            OrderItem.objects.create(order=order, **item)
        return order