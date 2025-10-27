from rest_framework import serializers
from .models import Course, Video, Enrollment, Category


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for course categories."""
    
    class Meta:
        model = Category
        fields = ["id", "name"]
     #   fields = ('id', 'name', 'description', 'created_at')


class VideoSerializer(serializers.ModelSerializer):
    """Serializer for course videos."""
    
    video_url_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Video
        fields = ('id', 'title', 'description', 'video_url', 'video_url_display', 'duration', 'order', 'created_at')
    
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
     fields = ["id", "title", "description", "thumbnail_url", "duration", "is_published", "category", "category_id", "video_count", "created_at"]
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
        fields = ('id', 'title', 'description', 'thumbnail_url', 'category_name', 'duration', 'video_count', 
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
