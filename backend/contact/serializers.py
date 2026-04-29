from .models import Contact
from rest_framework import serializers

class ContactSerializer(serializers.ModelSerializer):
    class meta:
        model = Contact
        fields = '__all__'

