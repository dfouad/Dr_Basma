"""
URL configuration for Arabic Online Course Platform.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
<<<<<<< HEAD
from rest_framework.routers import DefaultRouter
from courses.views import CourseViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'categories', CategoryViewSet)
=======
>>>>>>> origin/main

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/', include('courses.urls')),
<<<<<<< HEAD
    path('api/', include(router.urls)),
=======
>>>>>>> origin/main
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
