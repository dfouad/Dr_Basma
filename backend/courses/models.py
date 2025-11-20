from django.db import models
from django.contrib.auth import get_user_model
import uuid
from cloudinary_storage.storage import RawMediaCloudinaryStorage
User = get_user_model()


class Category(models.Model):
    """Course category model."""
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Course(models.Model):
    """Course model."""
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to='course_thumbnails/', blank=True, null=True)
    thumbnail_url = models.URLField(blank=True, null=True, help_text='Alternative to uploading thumbnail file')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='courses')
    duration = models.CharField(max_length=50, help_text='e.g., 10 hours')
    duration_in_days = models.PositiveIntegerField(default=1, help_text='Course duration in days for progress calculation')
    price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True, help_text='Course price (null or 0 for free courses)')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    @property
    def video_count(self):
        """Return the number of videos in this course."""
        return self.videos.count()


class Video(models.Model):
    """Video model."""
    
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='videos', null=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    video_file = models.FileField(upload_to='course_videos/', blank=True, null=True)
    video_url = models.URLField(blank=True, help_text='Alternative to uploading file')
    duration = models.CharField(max_length=20, help_text='e.g., 15:30')
    order = models.PositiveIntegerField(default=0)
    is_free = models.BooleanField(default=False, help_text='Mark video as free for public access')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return f'{self.title}'


class Enrollment(models.Model):
    """Enrollment model to track user course enrollments."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)
    progress = models.PositiveIntegerField(default=0, help_text='Progress percentage (0-100)')
    last_watched = models.ForeignKey(Video, on_delete=models.SET_NULL, null=True, blank=True, related_name='last_watched_by')
    watched_video_ids = models.JSONField(default=list, blank=True, help_text='List of watched video IDs')
    
    class Meta:
        unique_together = ('user', 'course')
        ordering = ['-enrolled_at']
    
    def __str__(self):
        return f'{self.user.email} enrolled in {self.course.title}'
    
    def update_progress(self):
        """Calculate and update progress based on course duration in days."""
        # Ensure watched_video_ids is always a list of unique integers
        watched_ids = self.watched_video_ids or []
        if not isinstance(watched_ids, list):
            try:
                import json
                watched_ids = json.loads(watched_ids) if watched_ids else []
            except Exception:
                watched_ids = []

        # Normalise and deduplicate IDs
        normalized_ids = {int(v) for v in watched_ids if str(v).isdigit()}

        duration_in_days = self.course.duration_in_days
        if duration_in_days <= 0:
            self.progress = 0
        else:
            watched_count = len(normalized_ids)
            self.progress = min(100, int((watched_count / duration_in_days) * 100))

        # Persist normalized list back to the field
        self.watched_video_ids = sorted(normalized_ids)
        self.save()




class PDF(models.Model):
    """PDF document model."""
    
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='pdfs')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    pdf_file =  models.FileField(
        upload_to='course_pdfs/',
        storage=RawMediaCloudinaryStorage(),
        blank=True,
        null=True,
    )
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'created_at']
        verbose_name = 'PDF'
        verbose_name_plural = 'PDFs'
    
    def __str__(self):
        return f'{self.course.title} - {self.title}'


   
class Certificate(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="certificates")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="certificates")
    full_name = models.CharField(max_length=255)
    coach_name = models.CharField(max_length=255, blank=True, null=True)
    issue_date = models.DateTimeField(auto_now_add=True)
    pdf = models.FileField(upload_to="certificates/", blank=True, null=True)

    def __str__(self):
        return f"{self.full_name} - {self.course.title}"
    
    class Meta:
        unique_together = ('user', 'course')
        ordering = ['-issue_date']


class Feedback(models.Model):
    """Feedback/Review model for courses."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedbacks')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='feedbacks')
    rating = models.PositiveIntegerField(help_text='Rating from 1 to 5')
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('user', 'course')
        ordering = ['-created_at']
    
    def __str__(self):
        return f'{self.user.email} - {self.course.title} ({self.rating}⭐)'
    

class ReviewPhoto(models.Model):
    """Model to store review photos for display on homepage."""
    
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='reviews/')
    show_on_homepage = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order', '-uploaded_at']
    
    def __str__(self):
        return self.title
   