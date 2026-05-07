from django.contrib.auth.models import User
from rest_framework import serializers
from .models import CompanyConfiguration
class RegisterSerializer(serializers.ModelSerializer):
    contact = serializers.CharField(write_only= True)
    password = serializers.CharField(write_only=True,min_length=6)
      
    class Meta:
        model=User
        fields=('username','email','password','contact','first_name','last_name')

    def create(self,validated_data):
        contact = validated_data.pop('contact')
        # user= User.objects.create_user(
        #     username = validated_data['username'],
        #     email = validated_data['email'],
        #     password = validated_data['password'],
        #     first_name=validated_data['first_name'],
        #     last_name=validated_data['last_name']
        # )
        user = User.objects.create_user(**validated_data)
        user.profile.contact = contact
        user.profile.save()
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