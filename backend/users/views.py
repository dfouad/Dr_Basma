from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .serializers import RegisterSerializer, UserSerializer, ChangePasswordSerializer, PendingUserSerializer
from .models import PendingUser


User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """API endpoint for user registration - creates pending user and sends verification email."""
    
    queryset = PendingUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = PendingUserSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        pending_user = serializer.save()
        
        # Send verification email
        try:
            print(f"Frontend URL: {settings.FRONTEND_URL}")
            print(f"User Email: {pending_user.email}")
            print(f"User Token: {pending_user.token}")
            print(f"User First Name: {pending_user.first_name}")
            
            verification_url = f"{settings.FRONTEND_URL}/verify-email?token={pending_user.token}"
            print(f"Verification URL: {settings.FRONTEND_URL}")
            # Render HTML email template
            
            html_message = render_to_string('users/verification_email.html', {
                'verification_url': verification_url,
                'email': pending_user.email,
                'first_name': pending_user.first_name or 'User',
            })
            plain_message = strip_tags(html_message)



            send_mail(
                subject='تأكيد البريد الإلكتروني - دكتور سعادة',
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[pending_user.email],
                html_message=html_message,
                fail_silently=False,
            )
            
            return Response(
                {
                    'message': 'Registration successful. Please check your email to verify your account.',
                    'email': pending_user.email
                },
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            # If email fails, delete the pending user
            pending_user.delete()
            return Response(
                {'error': f'Failed to send verification email: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserDetailView(generics.RetrieveUpdateAPIView):
    """API endpoint for viewing and updating user profile."""
    
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user


class ChangePasswordView(generics.UpdateAPIView):
    """API endpoint for changing user password."""
    
    permission_classes = (IsAuthenticated,)
    serializer_class = ChangePasswordSerializer
    
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            # Check old password
            if not user.check_password(serializer.data.get('old_password')):
                return Response(
                    {'old_password': ['Wrong password.']},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Set new password
            user.set_password(serializer.data.get('new_password'))
            user.save()
            
            return Response(
                {'message': 'Password updated successfully'},
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmailView(generics.GenericAPIView):
    """API endpoint for email verification."""
    
    permission_classes = (AllowAny,)
    
    def get(self, request, *args, **kwargs):
        token = request.query_params.get('token')
        
        if not token:
            return Response(
                {'error': 'Verification token is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            pending_user = PendingUser.objects.get(token=token)
            
            # Check if token has expired
            if pending_user.is_expired():
                pending_user.delete()
                return Response(
                    {'error': 'Verification token has expired. Please register again.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create the actual user
            user = User.objects.create(
                email=pending_user.email,
                first_name=pending_user.first_name,
                last_name=pending_user.last_name,
            )
            user.password = pending_user.password  # Already hashed
            user.save()
            
            # Delete the pending user
            pending_user.delete()
            
            return Response(
                {
                    'message': 'Email verified successfully. You can now login.',
                    'email': user.email
                },
                status=status.HTTP_200_OK
            )
            
        except PendingUser.DoesNotExist:
            return Response(
                {'error': 'Invalid or expired verification token.'},
                status=status.HTTP_400_BAD_REQUEST
            )
