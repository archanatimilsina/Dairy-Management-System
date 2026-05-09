from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    unit = models.CharField(max_length=20) 

    def __str__(self):
        return f"{self.name} ({self.unit})"

class Product(models.Model):
    product_name=models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    price=models.DecimalField(max_digits=20,decimal_places=2)
    picture_src=models.ImageField(upload_to='products/',null=True, blank=True)
    description=models.TextField(blank=True,null=True)
    stock=models.IntegerField(default=0)
    def __str__(self):
        return self.product_name
    

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.product.product_name}"


