from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


# Create your models here

class Profile(models.Model):
    user_type_choices=[
        ('regular','Regular'),
        ('occasional','Occasional'),
        ('visitor',"Visitor")
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    contact = models.CharField(null=True, blank=True)
    user_type = models.CharField(choices=user_type_choices,default='visitor')
    

@receiver(post_save, sender=User)
def _post_save_receiver(sender,instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save()
    

    


 

