from django.contrib.auth.models import User

from rest_framework import serializers
from .models import CompanyConfiguration, Profile

class RegisterSerializer(serializers.ModelSerializer):
    contact = serializers.CharField(write_only= True)
    password = serializers.CharField(write_only=True,min_length=6)
      
    class Meta:
        model=User
        fields=('username','email','password','contact','first_name','last_name')

    def create(self,validated_data):
        contact = validated_data.pop('contact')
        user = User.objects.create_user(**validated_data)
        # create_user fires the post_save receiver that already made the Profile;
        # set contact with a single UPDATE instead of refetching and re-saving.
        Profile.objects.filter(user=user).update(contact=contact)
        return user
    

    
class UserSerializer(serializers.ModelSerializer):
        contact = serializers.CharField(source = 'profile.contact')
        user_type = serializers.CharField(source = 'profile.user_type')
        status = serializers.SerializerMethodField()
        def get_status(self, obj):
             if obj.is_active:
                  return "active"
             return "inactive"

        class Meta:
            model = User
            fields = ('username', 'email', 'contact', 'first_name', 'last_name', 'user_type','status','date_joined')


class CompanyConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyConfiguration
        fields = [
            'company_name', 
            'support_email', 
            'contact_phone', 
            'office_address', 
            'system_sender_email', 
            'system_password', 
            'facebook_url', 
            'instagram_url', 
            'tiktok_url'
        ]
        extra_kwargs = {
            'system_password': {'write_only': True}
        }



