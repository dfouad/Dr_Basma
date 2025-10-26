# Arabic Online Course Platform - Django Backend

Complete REST API backend for the Arabic Online Course Platform built with Django and Django REST Framework.

## Features

- ✅ JWT Authentication (email-based login)
- ✅ User Registration & Profile Management
- ✅ Course Management System
- ✅ Video Upload & Streaming
- ✅ Enrollment System
- ✅ Admin Dashboard
- ✅ CORS Enabled for React Frontend

## Tech Stack

- **Django 5.0.3** - Web framework
- **Django REST Framework** - REST API toolkit
- **Simple JWT** - JWT authentication
- **PostgreSQL / SQLite** - Database
- **Pillow** - Image processing

## Installation

### 1. Prerequisites

- Python 3.10 or higher
- pip (Python package manager)
- PostgreSQL (optional, SQLite by default)

### 2. Clone and Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env file with your settings
# For development, the defaults work fine
```

### 4. Database Setup

```bash
# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser for admin access
python manage.py createsuperuser
```

### 5. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication
```
POST /api/auth/register/          - Register new user
POST /api/auth/login/             - Login (get JWT tokens)
POST /api/auth/token/refresh/     - Refresh access token
GET  /api/auth/profile/           - Get user profile
PUT  /api/auth/profile/           - Update user profile
POST /api/auth/change-password/   - Change password
```

### Courses
```
GET  /api/courses/                - List all published courses
GET  /api/courses/<id>/           - Get course details
GET  /api/courses/<id>/videos/    - List course videos (enrolled only)
GET  /api/categories/             - List all categories
```

### Enrollments
```
GET  /api/enrollments/            - List user's enrollments
POST /api/enrollments/create/     - Enroll in a course
PUT  /api/enrollments/<id>/update/ - Update progress
```

## Admin Dashboard

Access the Django admin panel at `http://localhost:8000/admin/`

Features:
- ✅ Upload and manage videos
- ✅ Create and organize courses
- ✅ Manage user enrollments
- ✅ View statistics
- ✅ Content moderation

## Database Models

### User
- Custom user model with email authentication
- Fields: email, first_name, last_name, is_active, is_staff

### Course
- Fields: title, description, thumbnail, category, duration, is_published
- Related: videos, enrollments

### Video
- Fields: title, description, video_file, video_url, duration, order
- Belongs to: Course

### Enrollment
- Links users to courses
- Tracks: progress, last_watched video, enrollment date

### Category
- Organizes courses by topic
- Fields: name, description

## Media Files

During development, media files are served from `/media/` directory:

```
backend/media/
├── course_thumbnails/     # Course thumbnail images
└── course_videos/         # Uploaded video files
```

## Production Deployment

For production:

1. **Security Settings:**
   - Set `DEBUG=False`
   - Change `SECRET_KEY`
   - Configure `ALLOWED_HOSTS`

2. **Database:**
   - Switch to PostgreSQL
   - Update `.env` with production database credentials

3. **Static & Media Files:**
   - Configure AWS S3 or similar for file storage
   - Set up CDN for video delivery

4. **CORS:**
   - Update `CORS_ALLOWED_ORIGINS` with production frontend URL

5. **Web Server:**
   - Use Gunicorn + Nginx
   - Configure SSL certificates

## Testing API

### Using cURL:

```bash
# Register user
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","password2":"password123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# List courses (using access token)
curl http://localhost:8000/api/courses/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Connecting to React Frontend

Update your React frontend to use these API endpoints:

```typescript
// Example API configuration
const API_BASE_URL = 'http://localhost:8000/api';

// Login example
const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  return data; // Contains access and refresh tokens
};
```

## Troubleshooting

**CORS Issues:**
- Ensure frontend URL is in `CORS_ALLOWED_ORIGINS` in settings.py

**Media Files Not Loading:**
- Check `MEDIA_ROOT` and `MEDIA_URL` in settings.py
- Ensure development server is running

**Database Errors:**
- Run `python manage.py migrate` to apply migrations
- Check database connection settings in `.env`

## Support

For issues or questions, refer to:
- [Django Documentation](https://docs.djangoproject.com/)
- [DRF Documentation](https://www.django-rest-framework.org/)
- [Simple JWT Documentation](https://django-rest-framework-simplejwt.readthedocs.io/)
