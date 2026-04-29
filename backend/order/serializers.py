from rest_framework import serializers
from .models import OrderItem,Order
class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        models= OrderItem
        fields = '__all__'
        