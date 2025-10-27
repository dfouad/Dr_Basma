from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from .models import Course, Video, Enrollment, Category
from .serializers import (
    CourseListSerializer, CourseDetailSerializer, VideoSerializer,
    EnrollmentSerializer, EnrollmentCreateSerializer, CategorySerializer
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
        course_id = request.data.get('course')
        
        # Check if already enrolled
        if Enrollment.objects.filter(user=request.user, course_id=course_id).exists():
            return Response(
                {'message': 'You are already enrolled in this course.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
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


# Admin Views
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
        }
        return Response(stats)
