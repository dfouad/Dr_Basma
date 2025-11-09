from rest_framework import serializers
from .models import Course, Video, Enrollment, Category, PDF, Certificate


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for course categories."""
    
    class Meta:
        model = Category
        fields = ["id", "name"]
     #   fields = ('id', 'name', 'description', 'created_at')


class VideoSerializer(serializers.ModelSerializer):
    """Serializer for course videos."""
    
    video_url_display = serializers.SerializerMethodField()
    course_title = serializers.CharField(source='course.title', read_only=True)
    
    class Meta:
        model = Video
        fields = ('id', 'title', 'description', 'video_url', 'video_url_display', 'duration', 'order', 'course', 'course_title', 'is_free', 'created_at')
    
    def get_video_url_display(self, obj):
        """Return the appropriate video URL (file or external)."""
        if obj.video_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.video_file.url)
            return obj.video_file.url
        return obj.video_url


class CourseListSerializer(serializers.ModelSerializer):
    """Serializer for course list view."""
    
  #  category_name = serializers.CharField(source='category.name', read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source="category",
        queryset=Category.objects.all(),
        write_only=True
    )

    thumbnail_url = serializers.SerializerMethodField()
    
    class Meta:
     model = Course
      #  fields = ('id', 'title', 'description', 'thumbnail_url', 'category_name', 'duration', 'video_count', 'created_at')
     fields = ["id", "title", "description", "thumbnail_url", "duration", "price", "is_published", "category", "category_id", "video_count", "created_at"]
    def get_thumbnail_url(self, obj):
        """Return the full thumbnail URL."""
        if obj.thumbnail:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None


class CourseDetailSerializer(serializers.ModelSerializer):
    """Serializer for course detail view."""
    
    videos = VideoSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    thumbnail_url = serializers.SerializerMethodField()
    is_enrolled = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = ('id', 'title', 'description', 'thumbnail_url', 'category_name', 'duration', 'price', 'video_count', 
                  'videos', 'is_enrolled', 'created_at', 'updated_at')
    
    def get_thumbnail_url(self, obj):
        """Return the full thumbnail URL."""
        if obj.thumbnail:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None
    
    def get_is_enrolled(self, obj):
        """Check if the current user is enrolled in this course."""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Enrollment.objects.filter(user=request.user, course=obj).exists()
        return False


class EnrollmentSerializer(serializers.ModelSerializer):
    """Serializer for course enrollments."""
    
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_thumbnail = serializers.SerializerMethodField()
    last_watched_title = serializers.CharField(source='last_watched.title', read_only=True)
    course = CourseListSerializer(read_only=True)  # nested course data
    
    class Meta:
        model = Enrollment
        fields = ('id', 'course', 'course_title', 'course_thumbnail', 'enrolled_at', 
                  'progress', 'last_watched', 'last_watched_title')
        read_only_fields = ('enrolled_at',)
    
    def get_course_thumbnail(self, obj):
        """Return the full course thumbnail URL."""
        if obj.course.thumbnail:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.course.thumbnail.url)
            return obj.course.thumbnail.url
        return None


class EnrollmentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating enrollments."""
    
    class Meta:
        model = Enrollment
        fields = ('course',)
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class PDFSerializer(serializers.ModelSerializer):
    """Serializer for PDF documents."""
    
    pdf_url = serializers.SerializerMethodField()
    course_title = serializers.CharField(source='course.title', read_only=True)
    
    class Meta:
        model = PDF
        fields = ('id', 'course', 'course_title', 'title', 'description', 'pdf_file', 'pdf_url', 'order', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')
    
    def get_pdf_url(self, obj):
        """Return the full PDF URL."""
        if obj.pdf_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.pdf_file.url)
            return obj.pdf_file.url
        return None


class CertificateSerializer(serializers.ModelSerializer):
    """Serializer for certificates."""
    
    user_name = serializers.SerializerMethodField()
    course_title = serializers.CharField(source='course.title', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Certificate
        fields = ('id', 'user', 'user_email', 'user_name', 'course', 'course_title', 'enrollment', 
                  'certificate_number', 'issued_at', 'template_text')
        read_only_fields = ('certificate_number', 'issued_at')
    
    def get_user_name(self, obj):
        """Return user's full name."""
        if obj.user.first_name and obj.user.last_name:
            return f'{obj.user.first_name} {obj.user.last_name}'
        return obj.user.email


class AdminAssignCourseSerializer(serializers.Serializer):
    """Serializer for admin to assign courses to users."""
    
    user_id = serializers.IntegerField()
    course_id = serializers.IntegerField()
    
    def validate(self, attrs):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        try:
            user = User.objects.get(id=attrs['user_id'])
            if user.is_staff:
                raise serializers.ValidationError("لا يمكن تعيين دورات للمسؤولين")
        except User.DoesNotExist:
            raise serializers.ValidationError("المستخدم غير موجود")
        
        try:
            course = Course.objects.get(id=attrs['course_id'])
        except Course.DoesNotExist:
            raise serializers.ValidationError("الدورة غير موجودة")
        
        # Check if already enrolled
        if Enrollment.objects.filter(user=user, course=course).exists():
            raise serializers.ValidationError("المستخدم مسجل في هذه الدورة بالفعل")
        
        attrs['user'] = user
        attrs['course'] = course
        return attrs
    
    def save(self):
        return Enrollment.objects.create(
            user=self.validated_data['user'],
            course=self.validated_data['course']
        )


class AdminUnassignCourseSerializer(serializers.Serializer):
    """Serializer for admin to unassign courses from users."""
    
    user_id = serializers.IntegerField()
    course_id = serializers.IntegerField()
