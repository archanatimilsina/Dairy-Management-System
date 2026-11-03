from django.conf import settings
from django.db import models
from product.models import Product

class Order(models.Model):
    DELIVERY_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('taken', 'Taken'),
        ('delivering', 'In Transit'),
        ('success', 'Delivered'),
        ('delayed', 'Delayed'),
    ]
    ORDER_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('resolved', 'Resolved'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected')
    ]

    # Owner. Nullable for the backfill migration (historic rows matched by
    # email); all new rows set it in OrderListCreateView.perform_create.
    # SET_NULL keeps order history if a customer account is deleted.
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='orders',
    )
    full_name = models.CharField(max_length=200)
    email = models.EmailField(max_length=254)
    contact_number = models.CharField(max_length=25)
    total_amount = models.DecimalField(max_digits=20, decimal_places=2)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    delivery_status = models.CharField(max_length=20, choices=DELIVERY_STATUS_CHOICES, default='pending')
    location = models.CharField(max_length=200)
    order_type = models.CharField(max_length=50, default="Physical")
    order_status= models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default ="pending")
    admin_note = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.id} - {self.full_name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, related_name="order_items")
    product_name = models.CharField(max_length=200)
    quantity = models.PositiveIntegerField(default=1)
    unit = models.CharField(max_length=50)
    price_at_purchase = models.DecimalField(max_digits=20, decimal_places=2,null=True, blank=True)

    @property
    def subtotal(self):
        qty = self.quantity or 0
        price = self.price_at_purchase or 0
        return qty * price
    def __str__(self):
        return f"{self.product_name} ({self.quantity})"
