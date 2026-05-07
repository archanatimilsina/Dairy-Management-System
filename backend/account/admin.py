from django.contrib import admin
from .models import Profile
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from django.shortcuts import redirect
from django.urls import reverse
from .models import CompanyConfiguration
admin.site.unregister(User)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'username', 'first_name', 'last_name', 'date_joined','is_active')


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_username', 'get_email', 'contact', 'user_type')
    
    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = 'Username'

    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = 'Email'


@admin.register(CompanyConfiguration)
class CompanyConfigurationAdmin(admin.ModelAdmin):
    
    fieldsets = (
        ('Corporate Identity', {
            'fields': ('company_name', 'office_address', 'contact_phone')
        }),
        ('System & Secure Mail', {
            'fields': ('system_sender_email', 'system_password', 'support_email'),
            'description': 'Credentials used for automated notifications and customer support.'
        }),
        ('Social Presence', {
            'fields': ('facebook_url', 'instagram_url', 'tiktok_url'),
        }),
    )

    def has_add_permission(self, request):
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):

        obj, created = self.model.objects.get_or_create(pk=1)
        return redirect(reverse(
            f'admin:{self.model._meta.app_label}_{self.model._meta.model_name}_change',
            args=(obj.pk,)
        ))