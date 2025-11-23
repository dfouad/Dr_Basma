from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import PendingUser

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user details."""
    
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'is_staff', 'date_joined')
        read_only_fields = ('id', 'is_staff', 'date_joined')


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ('email', 'password', 'password2', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False}
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change."""
    
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])


class PendingUserSerializer(serializers.ModelSerializer):
    """Serializer for pending user registration."""
    
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = PendingUser
        fields = ('email', 'password', 'password2', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False}
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        # Check if email already exists in User model
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})
        
        # Check if email already exists in PendingUser and delete old ones
        PendingUser.objects.filter(email=attrs['email']).delete()
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        
        # Create pending user with hashed password
        from django.contrib.auth.hashers import make_password
        pending_user = PendingUser.objects.create(
            password=make_password(password),
            **validated_data
        )
        return pending_user
