from django.urls import path
from .views import (
    CategoryListView, CourseListView, CourseDetailView,
    CourseVideosView, CoursePDFsView, EnrollmentListView, EnrollmentCreateView,
    EnrollmentUpdateView, AdminCourseListView, AdminCourseCreateView, AdminCourseUpdateView,
    AdminCourseDeleteView, AdminVideoListView, AdminVideoCreateView, AdminVideoUpdateView,
    AdminVideoDeleteView, AdminUserListView, AdminUserUpdateView,
    AdminUserDeleteView, AdminStatsView, AdminPDFListView, AdminPDFCreateView,
    AdminPDFUpdateView, AdminPDFDeleteView, UserCertificateListView, FreeVideoListView,
    AdminAssignCourseView, AdminUnassignCourseView, AdminUserEnrollmentsView,
    
    FeedbackListCreateView, FeedbackDetailView)
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
#router.register(r'certificates', UserCertificateListView, basename='certificate')

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category_list'),
    path('courses/', CourseListView.as_view(), name='course_list'),
    path('courses/<int:pk>/', CourseDetailView.as_view(), name='course_detail'),
    path('courses/<int:course_id>/videos/', CourseVideosView.as_view(), name='course_videos'),
    path('courses/<int:course_id>/pdfs/', CoursePDFsView.as_view(), name='course_pdfs'),
    path('courses/<int:course_id>/enroll/', EnrollmentCreateView.as_view(), name='course_enroll'),
    path('enrollments/', EnrollmentListView.as_view(), name='enrollment_list'),
    path('enrollments/create/', EnrollmentCreateView.as_view(), name='enrollment_create'),
    path('enrollments/<int:pk>/update/', EnrollmentUpdateView.as_view(), name='enrollment_update'),
    path('<int:course_id>/generate/', UserCertificateListView.as_view(), name='generate-certificate'),
    path('videos/free/', FreeVideoListView.as_view(), name='free_videos'),
    path('feedbacks/', FeedbackListCreateView.as_view(), name='feedback_list_create'),
    path('feedbacks/<int:pk>/', FeedbackDetailView.as_view(), name='feedback_detail'),
  #  path('certificates', UserCertificateListView.as_view(), name='user-certificates'),
    
    path("api/certificates/", UserCertificateListView.as_view(), name="user-certificates"),
    path('create/', UserCertificateListView.as_view(), name='create-certificate'),
    

# Admin endpoints
    path('admin/courses/', AdminCourseListView.as_view(), name='admin_course_list'),
    path('admin/courses/create/', AdminCourseCreateView.as_view(), name='admin_course_create'),
    path('admin/courses/<int:pk>/update/', AdminCourseUpdateView.as_view(), name='admin_course_update'),
    path('admin/courses/<int:pk>/delete/', AdminCourseDeleteView.as_view(), name='admin_course_delete'),
    path('admin/videos/', AdminVideoListView.as_view(), name='admin_video_list'),
    path('admin/videos/create/', AdminVideoCreateView.as_view(), name='admin_video_create'),
    path('admin/videos/<int:pk>/update/', AdminVideoUpdateView.as_view(), name='admin_video_update'),
    path('admin/videos/<int:pk>/delete/', AdminVideoDeleteView.as_view(), name='admin_video_delete'),
    path('admin/pdfs/', AdminPDFListView.as_view(), name='admin_pdf_list'),
    path('admin/pdfs/create/', AdminPDFCreateView.as_view(), name='admin_pdf_create'),
    path('admin/pdfs/<int:pk>/update/', AdminPDFUpdateView.as_view(), name='admin_pdf_update'),
    path('admin/pdfs/<int:pk>/delete/', AdminPDFDeleteView.as_view(), name='admin_pdf_delete'),
    path('admin/users/', AdminUserListView.as_view(), name='admin_user_list'),
    path('admin/users/<int:pk>/update/', AdminUserUpdateView.as_view(), name='admin_user_update'),
    path('admin/users/<int:pk>/delete/', AdminUserDeleteView.as_view(), name='admin_user_delete'),
    path('admin/users/<int:user_id>/enrollments/', AdminUserEnrollmentsView.as_view(), name='admin_user_enrollments'),
    path('admin/assign-course/', AdminAssignCourseView.as_view(), name='admin_assign_course'),
    path('admin/unassign-course/', AdminUnassignCourseView.as_view(), name='admin_unassign_course'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin_stats'),
]+ router.urls