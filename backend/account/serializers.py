from django.contrib.auth.models import User

from django.db import transaction
from rest_framework import serializers
from .models import CompanyConfiguration, Profile

# Cache password validators at module level. Django's
# get_default_password_validators() instantiates fresh validators on every
# call -- CommonPasswordValidator re-reads + gunzips the ~20k common-password
# list from disk each time. On a Render shared vCPU + ephemeral disk that is
# pure waste on every /register/ request. One shared instance is thread-safe
# for validation (read-only after init).
_cached_password_validators = None


def _get_password_validators():
    global _cached_password_validators
    if _cached_password_validators is None:
        from django.contrib.auth.password_validation import get_default_password_validators
        _cached_password_validators = get_default_password_validators()
    return _cached_password_validators

class RegisterSerializer(serializers.ModelSerializer):
    contact = serializers.CharField(write_only=True, required=False, allow_blank=True, max_length=20, default='')
    user_type = serializers.ChoiceField(
        choices=[('regular', 'Regular'), ('occasional', 'Occasional'), ('visitor', 'Visitor')],
        write_only=True, required=False, default='visitor',
    )
    password = serializers.CharField(write_only=True, min_length=8, max_length=128)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'contact', 'user_type', 'first_name', 'last_name')
        extra_kwargs = {'email': {'required': True}}

    def validate_email(self, value):
        value = (value or '').strip().lower()
        if not value:
            raise serializers.ValidationError('Email is required.')
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return value

    def validate_password(self, value):
        from django.contrib.auth.password_validation import validate_password
        validate_password(value, password_validators=_get_password_validators())
        return value

    def create(self, validated_data):
        contact = validated_data.pop('contact', '') or ''
        user_type = validated_data.pop('user_type', 'visitor') or 'visitor'
        if user_type not in ('regular', 'occasional', 'visitor'):
            user_type = 'visitor'
        # One transaction, two writes: INSERT user (fires the post_save
        # receiver that creates the Profile) + single UPDATE of that row.
        # The old code did Profile.objects.update_or_create() here which is a
        # SELECT + UPDATE (2 round trips to remote Postgres, ~150-300ms each
        # from Render US -> Supabase). filter().update() is a single UPDATE,
        # with a get_or_create fallback only for the signal-race edge case.
        with transaction.atomic():
            user = User.objects.create_user(**validated_data)
            updated = Profile.objects.filter(user=user).update(
                contact=contact, user_type=user_type
            )
            if not updated:
                Profile.objects.get_or_create(
                    user=user,
                    defaults={'contact': contact, 'user_type': user_type},
                )
        return user



class UserSerializer(serializers.ModelSerializer):
    # Method fields (instead of source='profile.*') so a missing Profile
    # row returns None instead of raising AttributeError.
    contact = serializers.SerializerMethodField()
    user_type = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    def get_contact(self, obj):
        profile = getattr(obj, 'profile', None)
        return getattr(profile, 'contact', None)

    def get_user_type(self, obj):
        profile = getattr(obj, 'profile', None)
        return getattr(profile, 'user_type', None)

    def get_status(self, obj):
        if obj.is_active:
            return "active"
        return "inactive"

    class Meta:
        model = User
        fields = ('username', 'email', 'contact', 'first_name', 'last_name', 'user_type', 'status', 'date_joined')


class UserMeSerializer(serializers.ModelSerializer):
    """Self-service profile: customers read/update their own record.

    username/email/is_staff/is_superuser are never writable here —
    role escalation via PATCH is impossible by construction.
    """
    contact = serializers.CharField(max_length=20, required=False, allow_blank=True, allow_null=True)
    user_type = serializers.ChoiceField(
        choices=[('regular', 'Regular'), ('occasional', 'Occasional'), ('visitor', 'Visitor')],
        required=False,
    )
    status = serializers.SerializerMethodField(read_only=True)
    first_name = serializers.CharField(required=False, allow_blank=True, max_length=150)
    last_name = serializers.CharField(required=False, allow_blank=True, max_length=150)

    class Meta:
        model = User
        fields = ('username', 'email', 'contact', 'first_name', 'last_name',
                  'user_type', 'status', 'date_joined')
        read_only_fields = ('username', 'email', 'status', 'date_joined')

    def to_representation(self, instance):
        # The view select_related('profile'), so instance.profile is already
        # cached -- no extra query. Only hit the DB to self-heal legacy rows
        # created before the post_save signal existed.
        try:
            profile = instance.profile
        except Exception:
            profile, _ = Profile.objects.get_or_create(user=instance)
        rep = super().to_representation(instance)
        rep['contact'] = getattr(profile, 'contact', None)
        rep['user_type'] = getattr(profile, 'user_type', None)
        return rep

    def get_status(self, obj):
        return "active" if obj.is_active else "inactive"

    def validate_first_name(self, value):
        value = (value or '').strip()
        if len(value) > 150:
            raise serializers.ValidationError('Too long (max 150).')
        return value

    def validate_last_name(self, value):
        value = (value or '').strip()
        if len(value) > 150:
            raise serializers.ValidationError('Too long (max 150).')
        return value

    def validate_contact(self, value):
        if value is None:
            return value
        value = str(value).strip()
        if not value:
            return ''
        if len(value) > 20:
            raise serializers.ValidationError('Too long (max 20).')
        import re as _re
        if not _re.fullmatch(r'[0-9+\-\s()]+', value):
            raise serializers.ValidationError('Use digits, spaces, +, - or ().')
        return value

    def update(self, instance, validated_data):
        contact = validated_data.pop('contact', None)
        user_type = validated_data.pop('user_type', None)
        for attr in ('first_name', 'last_name'):
            if attr in validated_data:
                setattr(instance, attr, (validated_data[attr] or '').strip())
        instance.save(update_fields=['first_name', 'last_name'])
        if contact is not None or user_type is not None:
            profile, _ = Profile.objects.get_or_create(user=instance)
            if contact is not None:
                profile.contact = contact
            if user_type is not None:
                profile.user_type = user_type
            profile.save()
        return instance


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
