# Email Verification Setup Guide

This guide explains how to set up and use the email verification feature.

## Overview

The email verification system requires users to verify their email address before their account is created. This adds an extra layer of security and ensures valid email addresses.

## Setup Instructions

### 1. Run Database Migrations

First, create and apply the migration for the new `PendingUser` model:

```bash
cd backend
python manage.py makemigrations users
python manage.py migrate
```

### 2. Configure Email Settings

#### For Gmail:

1. **Enable 2-Step Verification** on your Google account:
   - Go to https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated 16-character password

3. **Update `.env` file** in the `backend` directory:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-16-char-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com
FRONTEND_URL=http://localhost:5173
```

**Important for Production:**
- Update `FRONTEND_URL` to your production domain (e.g., `https://drbasma.vercel.app`)
- Add your production domain to `CORS_ALLOWED_ORIGINS` in settings.py

#### For Other Email Providers:

Update these variables in `.env`:

```env
EMAIL_HOST=smtp.yourprovider.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@domain.com
EMAIL_HOST_PASSWORD=your-password
DEFAULT_FROM_EMAIL=your-email@domain.com
```

### 3. Test Email Configuration

You can test email sending using Django shell:

```bash
python manage.py shell
```

```python
from django.core.mail import send_mail
send_mail(
    'Test Email',
    'This is a test message.',
    'your-email@gmail.com',
    ['recipient@example.com'],
    fail_silently=False,
)
```

## How It Works

### Registration Flow:

1. **User submits registration form** → POST `/api/auth/register/`
   - System creates a `PendingUser` record (not a real `User` yet)
   - Generates a unique UUID token
   - Sends verification email with link

2. **User clicks verification link** → GET `/api/auth/verify-email/?token=<uuid>`
   - System validates the token
   - Creates the actual `User` account
   - Deletes the `PendingUser` record
   - Returns success message

3. **User can now login** → POST `/api/auth/login/`

### Email Template

The verification email is located at: `backend/templates/users/verification_email.html`

You can customize:
- Branding/colors
- Message text
- Logo (update the gradient colors to match your brand)

### Token Expiration

- Tokens are valid for **24 hours** by default
- After expiration, users must register again
- Expired tokens are automatically rejected

### Security Features

- Passwords are hashed before storing in `PendingUser`
- Tokens are unique UUIDs
- Old pending registrations are deleted when re-registering with the same email
- Email verification prevents spam registrations

## Frontend Pages

### Auth Page (`src/pages/Auth.tsx`)

- Shows success message after registration
- Displays user's email
- Reminds them to check email (including spam folder)

### Verify Email Page (`src/pages/VerifyEmail.tsx`)

- Automatic verification on page load
- Shows loading → success/error states
- Redirects to login on success
- Clear error messages

## Troubleshooting

### Email Not Sending

1. **Check Gmail settings**: Ensure 2-Step Verification and App Password are set up correctly
2. **Check console logs**: Look for error messages in terminal
3. **Test SMTP connection**: Use the Django shell test above
4. **Check firewall**: Ensure port 587 is not blocked

### Token Invalid/Expired

- Tokens expire after 24 hours
- Users must register again with a fresh token
- Check that `FRONTEND_URL` matches your actual frontend URL

### Email Goes to Spam

- Use a verified domain email (not Gmail for production)
- Consider using email services like SendGrid, Mailgun, or AWS SES
- Add SPF and DKIM records to your domain

## Production Recommendations

1. **Use a dedicated email service** (SendGrid, Mailgun, AWS SES)
2. **Set up proper DNS records** (SPF, DKIM, DMARC)
3. **Use environment variables** for all sensitive data
4. **Monitor email delivery rates**
5. **Implement rate limiting** on registration endpoint
6. **Add CAPTCHA** to prevent bot registrations

## API Endpoints

### POST `/api/auth/register/`

Request body:
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "password2": "securepassword",
  "first_name": "John",
  "last_name": "Doe"
}
```

Success response (201):
```json
{
  "message": "Registration successful. Please check your email to verify your account.",
  "email": "user@example.com"
}
```

### GET `/api/auth/verify-email/?token=<uuid>`

Success response (200):
```json
{
  "message": "Email verified successfully. You can now login.",
  "email": "user@example.com"
}
```

Error response (400):
```json
{
  "error": "Invalid or expired verification token."
}
```

## Database Models

### PendingUser Model

Located in: `backend/users/models.py`

Fields:
- `email`: EmailField (unique)
- `password`: CharField (hashed)
- `first_name`: CharField
- `last_name`: CharField
- `token`: UUIDField (unique, auto-generated)
- `created_at`: DateTimeField (auto)
- `expires_at`: DateTimeField (24h from creation)

## Support

If you encounter issues:
1. Check the terminal logs for error messages
2. Verify all environment variables are set correctly
3. Test email configuration separately
4. Ensure frontend URL matches in all environments
