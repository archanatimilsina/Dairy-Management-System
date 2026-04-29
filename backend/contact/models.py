from django.db import models

# Create your models here.
class Contact(models.Model):
    full_name=models.CharField(max_length=200)
    email=models.EmailField(max_length=200)
    subject=models.CharField(max_length=200)
    message=models.TextField(max_length=1000)
    admin_note=models.CharField(max_length=200,blank=True,null=True)
    status=models.CharField(max_length=10,choices=[('new', 'New'), ('resolved', 'Resolved')],default='new')
    def __str__(self):
        return self.subject