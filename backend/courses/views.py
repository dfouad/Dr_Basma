from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from .models import Course, Video, Enrollment, Category, PDF, Certificate
from django.http import FileResponse, HttpResponseBadRequest
from rest_framework.views import APIView
from courses.models import Course
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
import uuid

from .serializers import (
    CourseListSerializer, CourseDetailSerializer, VideoSerializer,
    EnrollmentSerializer, EnrollmentCreateSerializer, CategorySerializer, PDFSerializer, CertificateSerializer,
    AdminAssignCourseSerializer, AdminUnassignCourseSerializer,
)
from .permissions import IsStaffUser



User = get_user_model()


class CategoryListView(generics.ListAPIView):
    """API endpoint for listing all categories."""
    
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (AllowAny,)


class CourseListView(generics.ListAPIView):
    """API endpoint for listing all published courses."""
    
    serializer_class = CourseListSerializer
    permission_classes = (AllowAny,)
   # pagination_class = None
    
    def get_queryset(self):
        queryset = Course.objects.filter(is_published=True)
        
        # Filter by category if provided
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__name__icontains=category)
        
        # Search by title or description
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(title__icontains=search) | queryset.filter(description__icontains=search)
        
        return queryset


class CourseDetailView(generics.RetrieveAPIView):
    """API endpoint for viewing course details."""
    
    serializer_class = CourseDetailSerializer
    permission_classes = (AllowAny,)
    
    def get_queryset(self):
        return Course.objects.filter(is_published=True)


class CourseVideosView(generics.ListAPIView):
    """API endpoint for listing videos in a course (only for enrolled users)."""
    
    serializer_class = VideoSerializer
    permission_classes = (IsAuthenticated,)
    
    def get_queryset(self):
        course_id = self.kwargs.get('course_id')
        course = get_object_or_404(Course, id=course_id, is_published=True)
        
        # Check if user is enrolled
        is_enrolled = Enrollment.objects.filter(user=self.request.user, course=course).exists()
        
        if not is_enrolled:
            return Video.objects.none()
        
        return Video.objects.filter(course=course)


class CoursePDFsView(generics.ListAPIView):
    """API endpoint for listing PDFs in a course (only for enrolled users)."""
    
    serializer_class = PDFSerializer
    permission_classes = (IsAuthenticated,)
    
    def get_queryset(self):
        course_id = self.kwargs.get('course_id')
        course = get_object_or_404(Course, id=course_id, is_published=True)
        
        # Check if user is enrolled
        is_enrolled = Enrollment.objects.filter(user=self.request.user, course=course).exists()
        
        if not is_enrolled:
            return PDF.objects.none()
        
        return PDF.objects.filter(course=course)


class EnrollmentListView(generics.ListAPIView):
    """API endpoint for listing user's enrollments."""
    
    serializer_class = EnrollmentSerializer
    permission_classes = (IsAuthenticated,)
    
    def get_queryset(self):
        return Enrollment.objects.filter(user=self.request.user)


class EnrollmentCreateView(generics.CreateAPIView):
    """API endpoint for enrolling in a course."""
    
    serializer_class = EnrollmentCreateSerializer
    permission_classes = (IsAuthenticated,)
    
    def create(self, request, *args, **kwargs):
        # Get course_id from URL kwargs or request data
        course_id = self.kwargs.get('course_id') or request.data.get('course')
        
        if not course_id:
            return Response(
                {'error': 'Course ID is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if course exists
        try:
            course = Course.objects.get(id=course_id, is_published=True)
        except Course.DoesNotExist:
            return Response(
                {'error': 'Course not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if already enrolled
        if Enrollment.objects.filter(user=request.user, course_id=course_id).exists():
            return Response(
                {'message': 'You are already enrolled in this course.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create enrollment
        Enrollment.objects.create(user=request.user, course_id=course_id)
        
        return Response(
            {'message': 'Successfully enrolled in the course.'},
            status=status.HTTP_201_CREATED
        )


class EnrollmentUpdateView(generics.UpdateAPIView):
    """API endpoint for updating enrollment progress."""
    
    serializer_class = EnrollmentSerializer
    permission_classes = (IsAuthenticated,)
    
    def get_queryset(self):
        return Enrollment.objects.filter(user=self.request.user)


class FreeVideoListView(generics.ListAPIView):
    """API endpoint for listing all free videos (public access)."""
    
    queryset = Video.objects.filter(is_free=True).order_by('order')
    serializer_class = VideoSerializer
    permission_classes = (AllowAny,)


# Admin Views
class AdminCourseListView(generics.ListAPIView):
    """Admin endpoint for listing all courses (including unpublished)."""
    
    queryset = Course.objects.all()
    serializer_class = CourseListSerializer
    permission_classes = (IsStaffUser,)


class AdminCourseCreateView(generics.CreateAPIView):
    """Admin endpoint for creating courses."""
    
    queryset = Course.objects.all()
    serializer_class = CourseDetailSerializer
    permission_classes = (IsStaffUser,)


class AdminCourseUpdateView(generics.UpdateAPIView):
    """Admin endpoint for updating courses."""
    
    queryset = Course.objects.all()
    serializer_class = CourseDetailSerializer
    permission_classes = (IsStaffUser,)


class AdminCourseDeleteView(generics.DestroyAPIView):
    """Admin endpoint for deleting courses."""
    
    queryset = Course.objects.all()
    permission_classes = (IsStaffUser,)


class AdminVideoListView(generics.ListAPIView):
    """Admin endpoint for listing all videos with optional course filter."""
    
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = (IsStaffUser,)
    
    def get_queryset(self):
        queryset = Video.objects.all()
        course_id = self.request.query_params.get('course', None)
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        return queryset.order_by('order')


class AdminVideoCreateView(generics.CreateAPIView):
    """Admin endpoint for creating videos."""
    
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = (IsStaffUser,)


class AdminVideoUpdateView(generics.UpdateAPIView):
    """Admin endpoint for updating videos."""
    
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = (IsStaffUser,)


class AdminVideoDeleteView(generics.DestroyAPIView):
    """Admin endpoint for deleting videos."""
    
    queryset = Video.objects.all()
    permission_classes = (IsStaffUser,)


class AdminUserListView(generics.ListAPIView):
    """Admin endpoint for listing all users."""
    
    permission_classes = (IsStaffUser,)
    
    def get(self, request, *args, **kwargs):
        users = User.objects.all().values('id', 'email', 'first_name', 'last_name', 'is_staff', 'date_joined')
        return Response(list(users))


class AdminUserUpdateView(generics.UpdateAPIView):
    """Admin endpoint for updating users."""
    
    queryset = User.objects.all()
    permission_classes = (IsStaffUser,)
    
    def update(self, request, *args, **kwargs):
        user = self.get_object()
        
        if 'first_name' in request.data:
            user.first_name = request.data['first_name']
        if 'last_name' in request.data:
            user.last_name = request.data['last_name']
        if 'is_staff' in request.data:
            user.is_staff = request.data['is_staff']
        
        user.save()
        return Response({'message': 'User updated successfully'})


class AdminUserDeleteView(generics.DestroyAPIView):
    """Admin endpoint for deleting users."""
    
    queryset = User.objects.all()
    permission_classes = (IsStaffUser,)


class AdminStatsView(generics.GenericAPIView):
    """Admin endpoint for dashboard statistics."""
    
    permission_classes = (IsStaffUser,)
    
    def get(self, request):
        stats = {
            'total_courses': Course.objects.count(),
            'published_courses': Course.objects.filter(is_published=True).count(),
            'total_videos': Video.objects.count(),
            'total_users': User.objects.count(),
            'total_enrollments': Enrollment.objects.count(),
            'total_pdfs': PDF.objects.count(),
            'total_certificates': Certificate.objects.count(),
        }
        return Response(stats)


class AdminPDFListView(generics.ListAPIView):
    """Admin endpoint for listing all PDFs."""
    
    queryset = PDF.objects.all()
    serializer_class = PDFSerializer
    permission_classes = (IsStaffUser,)


class AdminPDFCreateView(generics.CreateAPIView):
    """Admin endpoint for creating PDFs."""
    
    queryset = PDF.objects.all()
    serializer_class = PDFSerializer
    permission_classes = (IsStaffUser,)


class AdminPDFUpdateView(generics.UpdateAPIView):
    """Admin endpoint for updating PDFs."""
    
    queryset = PDF.objects.all()
    serializer_class = PDFSerializer
    permission_classes = (IsStaffUser,)


class AdminPDFDeleteView(generics.DestroyAPIView):
    """Admin endpoint for deleting PDFs."""
    
    queryset = PDF.objects.all()
    permission_classes = (IsStaffUser,)


class UserCertificateListView(generics.ListAPIView):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return current user's certificates
        return Certificate.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        user = request.user
        course_id = request.data.get("course_id")

        if not course_id:
            return Response({"error": "Course ID required"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if already exists
        existing = Certificate.objects.filter(user=user, course_id=course_id).first()
        if existing:
            return Response(
                {"message": "Certificate already exists"},
                status=status.HTTP_200_OK
            )  

        # Create new certificate
        certificate = Certificate.objects.create(user=user, course_id=course_id)
        serializer = self.get_serializer(certificate)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AdminAssignCourseView(generics.CreateAPIView):
    """Admin endpoint to assign a course to a user."""
    
    serializer_class = AdminAssignCourseSerializer
    permission_classes = [IsStaffUser]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        enrollment = serializer.save()
        return Response(
            EnrollmentSerializer(enrollment).data,
            status=status.HTTP_201_CREATED
        )


class AdminUnassignCourseView(generics.GenericAPIView):
    """Admin endpoint to unassign a course from a user."""
    
    serializer_class = AdminUnassignCourseSerializer
    permission_classes = [IsStaffUser]
    
    def delete(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user_id = serializer.validated_data['user_id']
        course_id = serializer.validated_data['course_id']
        
        try:
            enrollment = Enrollment.objects.get(user_id=user_id, course_id=course_id)
            enrollment.delete()
            return Response(
                {'message': 'تم إلغاء تسجيل المستخدم من الدورة بنجاح'},
                status=status.HTTP_200_OK
            )
        except Enrollment.DoesNotExist:
            return Response(
                {'error': 'المستخدم غير مسجل في هذه الدورة'},
                status=status.HTTP_404_NOT_FOUND
            )


class AdminUserEnrollmentsView(generics.ListAPIView):
    """Admin endpoint to view a user's enrollments."""
    
    serializer_class = EnrollmentSerializer
    permission_classes = [IsStaffUser]
    
    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return Enrollment.objects.filter(user_id=user_id).select_related('course', 'last_watched')