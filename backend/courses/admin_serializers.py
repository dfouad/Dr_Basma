from rest_framework import serializers
from .models import Course, Category
from .serializers import CategorySerializer


class AdminCourseSerializer(serializers.ModelSerializer):
    """Serializer for admin course management (includes all courses, not just published)."""
    
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
        required=False
    )
    thumbnail_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = ('id', 'title', 'description', 'thumbnail', 'thumbnail_url', 'category', 
                  'category_id', 'duration', 'video_count', 'is_published', 'created_at', 'updated_at')
        read_only_fields = ('video_count', 'created_at', 'updated_at')
    
    def get_thumbnail_url(self, obj):
        """Return the full thumbnail URL."""
        if obj.thumbnail:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None
