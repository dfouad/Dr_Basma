from django.urls import path
from .views import (
    CategoryListView, CourseListView, CourseDetailView,
    CourseVideosView, EnrollmentListView, EnrollmentCreateView,
    EnrollmentUpdateView, AdminCourseCreateView, AdminCourseUpdateView,
    AdminCourseDeleteView, AdminVideoCreateView, AdminVideoUpdateView,
    AdminVideoDeleteView, AdminUserListView, AdminUserUpdateView,
    AdminUserDeleteView, AdminStatsView
)

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category_list'),
    path('courses/', CourseListView.as_view(), name='course_list'),
    path('courses/<int:pk>/', CourseDetailView.as_view(), name='course_detail'),
    path('courses/<int:course_id>/videos/', CourseVideosView.as_view(), name='course_videos'),
    path('enrollments/', EnrollmentListView.as_view(), name='enrollment_list'),
    path('enrollments/create/', EnrollmentCreateView.as_view(), name='enrollment_create'),
    path('enrollments/<int:pk>/update/', EnrollmentUpdateView.as_view(), name='enrollment_update'),
    
    # Admin endpoints
    path('admin/courses/create/', AdminCourseCreateView.as_view(), name='admin_course_create'),
    path('admin/courses/<int:pk>/update/', AdminCourseUpdateView.as_view(), name='admin_course_update'),
    path('admin/courses/<int:pk>/delete/', AdminCourseDeleteView.as_view(), name='admin_course_delete'),
    path('admin/videos/create/', AdminVideoCreateView.as_view(), name='admin_video_create'),
    path('admin/videos/<int:pk>/update/', AdminVideoUpdateView.as_view(), name='admin_video_update'),
    path('admin/videos/<int:pk>/delete/', AdminVideoDeleteView.as_view(), name='admin_video_delete'),
    path('admin/users/', AdminUserListView.as_view(), name='admin_user_list'),
    path('admin/users/<int:pk>/update/', AdminUserUpdateView.as_view(), name='admin_user_update'),
    path('admin/users/<int:pk>/delete/', AdminUserDeleteView.as_view(), name='admin_user_delete'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin_stats'),
]
