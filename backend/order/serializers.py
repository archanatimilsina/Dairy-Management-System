from django.db import transaction
from rest_framework import serializers
from .models import OrderItem,Order


class OrderItemSerializer(serializers.ModelSerializer):
    quantity = serializers.IntegerField(min_value=1, max_value=99)
    class Meta:
        model= OrderItem
        fields = ['product', 'product_name','quantity', 'unit', 'price_at_purchase', 'subtotal']
        read_only_fields = ['product_name', 'unit', 'price_at_purchase', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many = True, read_only=True)
    username = serializers.ReadOnlyField(source='user.username')
    # Server fills owner/email from request.user; clients may omit email.
    email = serializers.EmailField(required=False, allow_blank=True)
    class Meta:
        model = Order
        fields = ['id', 'user', 'username', 'full_name', 'email', 'contact_number','total_amount','delivery_fee', 'delivery_status','location','order_type','admin_note','items','order_status','created_at']
        # delivery_status/order_status/admin_note are writable here but
        # OrderDetailView strips them for non-staff, so only admins can change them.
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'total_amount']

    @transaction.atomic
    def create(self, validated_data):
        from product.models import Product
        from decimal import Decimal
        # Client totals are ignored; server recomputes from Product.price.
        validated_data.pop('total_amount', None)
        validated_data.pop('delivery_status', None)
        validated_data.pop('order_status', None)
        validated_data.pop('admin_note', None)
        validated_data.pop('user', None)
        request = self.context.get('request')
        user = getattr(request, 'user', None) if request else None
        if user is not None and getattr(user, 'is_authenticated', False):
            # Owner is always the caller: prevents order spoofing via a
            # forged email and fixes history lookups without a backfill key.
            validated_data['user'] = user
            if getattr(user, 'email', None):
                validated_data['email'] = user.email
        if not validated_data.get('email'):
            raise serializers.ValidationError({'email': 'Email is required.'})
        delivery_fee = validated_data.get('delivery_fee') or Decimal('0')
        if delivery_fee < 0:
            raise serializers.ValidationError({'delivery_fee': 'Must be >= 0.'})
        items_data = self.initial_data.get('items') or []
        if not items_data:
            raise serializers.ValidationError({'items': 'At least one item is required.'})
        validated_data['total_amount'] = Decimal('0')
        order = Order.objects.create(**validated_data)
        total = Decimal('0')
        for raw_item in items_data:
            if not isinstance(raw_item, dict):
                continue
            if 'id' in raw_item and set(raw_item.keys()) == {'id'}:
                continue
            try:
                product = Product.objects.get(pk=raw_item.get('product'))
            except (Product.DoesNotExist, TypeError, ValueError):
                raise serializers.ValidationError({'items': 'Invalid product.'})
            try:
                qty = int(raw_item.get('quantity') or 0)
            except (TypeError, ValueError):
                raise serializers.ValidationError({'items': 'Invalid quantity.'})
            if qty < 1 or qty > 99:
                raise serializers.ValidationError({'items': 'Quantity must be 1-99.'})
            if product.stock is not None and product.stock < qty:
                raise serializers.ValidationError({'items': f'Insufficient stock for {product.product_name}.'})
            price = product.price
            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.product_name,
                quantity=qty,
                unit=product.category.unit if product.category_id else (raw_item.get('unit') or ''),
                price_at_purchase=price,
            )
            total += price * qty
        order.total_amount = total + delivery_fee
        order.save(update_fields=['total_amount'])
        return order
