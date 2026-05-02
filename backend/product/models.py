from django.db import models
from django.contrib.auth.models import User

class Product(models.Model):
    product_name=models.CharField(max_length=200)
    category=models.CharField(max_length=50)
    price=models.DecimalField(max_digits=20,decimal_places=2)
    picture_src=models.ImageField(upload_to='products/',null=True, blank=True)
    description=models.TextField(blank=True,null=True)
    unit=models.CharField(max_length=20)
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

   
    

