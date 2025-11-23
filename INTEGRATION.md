# Frontend-Backend Integration Guide

## Overview
The React frontend is now fully integrated with the Django backend API, enabling real-time data fetching, authentication, and course management.

## Setup Instructions

### 1. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

The default API URL is `http://127.0.0.1:8000/api` - change this if your Django backend runs on a different port.

### 2. Start the Backend
```bash
cd backend
python manage.py runserver
```

### 3. Start the Frontend
```bash
npm run dev
```

## Features Implemented

### ✅ Authentication System
- **Login & Registration**: Users can create accounts and log in using email/password
- **JWT Token Management**: Automatic token storage and refresh
- **Protected Routes**: Profile and Dashboard pages require authentication
- **Auto-redirect**: Authenticated users are redirected from login page to profile

**Files:**
- `src/contexts/AuthContext.tsx` - Auth state management
- `src/pages/Auth.tsx` - Login/Register UI
- `src/components/ProtectedRoute.tsx` - Route protection
- `src/lib/api.ts` - API configuration with token interceptors

### ✅ Courses Integration
- **Dynamic Course Loading**: Fetches all courses from `/api/courses/`
- **Search Functionality**: Client-side filtering of courses
- **Course Details**: Fetches individual course data from `/api/courses/:id/`
- **Video Access**: Enrolled users can view course videos

**Files:**
- `src/pages/Courses.tsx` - Course listing with search
- `src/pages/CourseDetail.tsx` - Course details and enrollment
- `src/components/CourseCard.tsx` - Course display component

### ✅ Enrollment System
- **Course Enrollment**: Users can enroll in courses via `/api/enrollments/create/`
- **Enrollment Check**: Automatic detection of enrolled courses
- **Video Access Control**: Only enrolled users can access course videos

**Files:**
- `src/pages/CourseDetail.tsx` - Enrollment logic
- `src/lib/api.ts` - Enrollment API methods

### ✅ User Profile
- **Profile Display**: Shows user information (name, email)
- **Enrolled Courses**: Fetches user's enrolled courses from `/api/enrollments/`
- **Progress Tracking**: Displays course completion progress
- **Last Watched**: Shows the last watched video for each course

**Files:**
- `src/pages/Profile.tsx` - User profile and enrolled courses

### ✅ Staff Dashboard Access Control
- **Role-based Access**: Dashboard only accessible to staff members
- **Staff Detection**: User's `is_staff` status is fetched from backend
- **Auto-redirect**: Non-staff users are redirected if they try to access dashboard
- **UI Conditional Rendering**: Dashboard link only shown to staff in navbar

**Creating a Staff User:**
```bash
# Access Django shell
cd backend
python manage.py shell

# Create a staff user
from django.contrib.auth import get_user_model
User = get_user_model()
user = User.objects.get(email='your_email@example.com')
user.is_staff = True
user.save()
```

Or use Django admin to make an existing user a staff member.

**Files:**
- `src/pages/Dashboard.tsx` - Staff dashboard with access control
- `src/components/Navbar.tsx` - Conditional dashboard link rendering
- `backend/users/serializers.py` - Includes `is_staff` in user data
- `backend/courses/permissions.py` - Staff permission class

### ✅ Navigation & UI
- **Dynamic Navbar**: Shows different options for authenticated/unauthenticated users
- **User Info Display**: Shows user name in navbar when logged in
- **Logout Functionality**: Clears tokens and redirects to home

**Files:**
- `src/components/Navbar.tsx` - Navigation with auth integration

## API Endpoints Used

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login (returns JWT tokens)
- `POST /api/auth/token/refresh/` - Refresh access token
- `GET /api/auth/profile/` - Get current user profile (includes `is_staff` status)
- `PATCH /api/auth/profile/` - Update user profile
- `PUT /api/auth/change-password/` - Change user password

### Courses
- `GET /api/courses/` - List all published courses
- `GET /api/courses/:id/` - Get course details
- `GET /api/courses/:id/videos/` - Get course videos (enrolled users only)

### Enrollments
- `GET /api/enrollments/` - List user's enrollments
- `POST /api/enrollments/create/` - Enroll in a course

## Token Management

The application uses JWT tokens with automatic refresh:
- **Access Token**: Stored in `localStorage` as `access_token`
- **Refresh Token**: Stored in `localStorage` as `refresh_token`
- **Auto-refresh**: When access token expires (401), automatically refreshes using refresh token
- **Auto-logout**: If refresh fails, clears tokens and redirects to login

## Error Handling

All API calls include error handling with user-friendly toast notifications:
- Login/registration errors display specific messages
- Network errors show generic "try again later" messages
- 403 errors on video access indicate user is not enrolled
- 401 errors trigger automatic token refresh or logout

## CORS Configuration

Make sure your Django backend has CORS properly configured in `backend/config/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]
```

## Testing the Integration

1. **Start both servers** (backend on port 8000, frontend on port 8080)
2. **Create a superuser** in Django admin to add courses
3. **Register a new user** through the frontend
4. **Browse courses** and enroll in one
5. **Check your profile** to see enrolled courses
6. **Test logout** and login again

## Common Issues

### CORS Errors
- Ensure Django backend has `django-cors-headers` installed
- Check `CORS_ALLOWED_ORIGINS` includes your frontend URL

### 401 Unauthorized
- Check if access token is present in localStorage
- Verify token hasn't expired
- Ensure Authorization header is properly set

### Cannot Access Videos
- Verify user is enrolled in the course
- Check enrollment exists in Django admin
- Ensure course has published videos

### Loading Issues
- Check browser console for errors
- Verify backend is running on correct port
- Check network tab for failed requests

## Next Steps

Consider implementing:
- Video player integration
- Progress tracking updates
- User profile editing
- Password reset functionality
- Course categories filtering
- Payment integration for paid courses
