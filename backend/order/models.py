from django.db import models
from product.models import Product

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('taken', 'Taken'), 
        ('delivering', 'In Transit'),
        ('success', 'Delivered'),
        ('delayed', 'Delayed'),
    ]
    full_name = models.CharField(max_length=200)
    email = models.EmailField(max_length=254) 
    contact_number = models.CharField(max_length=25)
    total_amount = models.DecimalField(max_digits=20, decimal_places=2)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    delivery_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    location = models.CharField(max_length=200)
    order_type = models.CharField(max_length=50, default="Physical") 
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
    price_at_purchase = models.DecimalField(max_digits=20, decimal_places=2)

    @property
    def subtotal(self):
        return self.quantity * self.price_at_purchase
    def __str__(self):
        return f"{self.product_name} ({self.quantity})"