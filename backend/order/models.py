from django.db import models
from product.models import Product

class Order(models.Model):
    delivery_choices=[
        ('pending','Pending'),
        ('delivered','Delivered'),
        ('in transit','In transit'),
        ('delayed','Delayed'),
    ]
    full_name=models.CharField(max_length=200)
    email=models.EmailField(max_length=20)
    contact_number=models.CharField(max_length=25)
    products=models.JSONField()
    total_amount=models.DecimalField(max_digits=20,decimal_places=2)
    delivery_status= models.CharField(choices=delivery_choices,default='pending')
    admin_note=models.CharField(max_length=200,blank=True,null=True)
    order_type=models.CharField(max_length=200)
    order_by=models.CharField(max_length=200,blank=True,null=True)
    location=models.CharField(max_length=200)
    


class OrderItem(models.Model):
    order=models.ForeignKey(Order,on_delete=models.CASCADE, related_name='items')
    product=models.ForeignKey(Product,on_delete=models.PROTECT,related_name="products")
    product_name=models.CharField(max_length=200)
    quantity=models.PositiveIntegerField()
    unit=models.CharField()
    price_at_purchase=models.DecimalField(decimal_places=2,max_digits=20)