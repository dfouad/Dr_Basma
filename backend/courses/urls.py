from django.urls import path
from .views import (
    CategoryListView, CourseListView, CourseDetailView,
    CourseVideosView, EnrollmentListView, EnrollmentCreateView,
    EnrollmentUpdateView
)

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category_list'),
    path('courses/', CourseListView.as_view(), name='course_list'),
    path('courses/<int:pk>/', CourseDetailView.as_view(), name='course_detail'),
    path('courses/<int:course_id>/videos/', CourseVideosView.as_view(), name='course_videos'),
    path('enrollments/', EnrollmentListView.as_view(), name='enrollment_list'),
    path('enrollments/create/', EnrollmentCreateView.as_view(), name='enrollment_create'),
    path('enrollments/<int:pk>/update/', EnrollmentUpdateView.as_view(), name='enrollment_update'),
]