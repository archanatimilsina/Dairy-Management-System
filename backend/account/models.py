from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    user_type_choices=[
        ('regular','Regular'),
        ('occasional','Occasional'),
        ('visitor',"Visitor")
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    contact = models.CharField(max_length=20, null=True, blank=True)
    user_type = models.CharField(max_length=20, choices=user_type_choices, default='visitor')
    

@receiver(post_save, sender=User)
def _post_save_receiver(sender,instance, created, **kwargs):
    if created:
        # Single INSERT, no preceding SELECT: on User create the Profile
        # never exists yet, so get_or_create's extra SELECT (+ SAVEPOINT when
        # inside the serializer's atomic block) is pure waste on every signup.
        try:
            Profile.objects.create(user=instance)
        except Exception:
            pass

# NOTE: the old second post_save receiver (`instance.profile.save()` on every
# User.save()) was removed. It fired an extra UPDATE on every register/login
# profile touch -- an extra 100-250ms round trip to the remote Postgres on
# every auth request for zero benefit (serializers use get_or_create anyway).
    

class CompanyConfiguration(models.Model):
    company_name = models.CharField(max_length=255, default="Dairy")
    office_address = models.TextField(blank=True, null=True)
    contact_phone = models.CharField(max_length=20, blank=True, null=True)

    system_sender_email = models.EmailField(help_text="Email used to send automated notifications")
    system_password = models.CharField(max_length=255, help_text="App-specific password for the sender email")
    support_email = models.EmailField(help_text="Customer-facing support email")

    facebook_url = models.URLField(blank=True, null=True)
    instagram_url = models.URLField(blank=True, null=True)
    tiktok_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return "System Configuration"

    class Meta:
        verbose_name = "Company Configuration"
        verbose_name_plural = "Company Configuration"

    def save(self, *args, **kwargs):
        self.pk = 1
        super(CompanyConfiguration, self).save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj