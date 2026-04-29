from django.db import models

# Create your models here.
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
    