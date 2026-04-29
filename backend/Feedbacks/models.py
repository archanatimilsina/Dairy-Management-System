from django.db import models

# Create your models here.

class Feedback(models.Model):
    TOPIC_CHOICES = [
        ('PRODUCT', 'Product Quality'),
        ('DELIVERY', 'Delivery Service'),
        ('PRICE', 'Pricing/Billing'),
        ('SUGGESTION', 'General Suggestion'),
        ('OTHER', 'Other'),
    ]
    full_name=models.CharField(max_length=200)
    email=models.EmailField(max_length=200)
    feedback=models.TextField(max_length=1000)
    created_at=models.DateTimeField(auto_now_add=True)
    feedback_topic=models.CharField(max_length=20, choices=TOPIC_CHOICES,default='OTHER')
    is_reviewed = models.BooleanField(default=False)
    class Meta:
        ordering=['-created_at']
    def __str__(self):
        return f"{self.full_name} -{self.feedback_topic}"