from django.contrib import admin
from .models import Category, Course, Video, Enrollment, PDF, Certificate, Feedback, ReviewPhoto


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin for Category model."""
    
    list_display = ('name', 'created_at')
    search_fields = ('name',)


class VideoInline(admin.TabularInline):
    """Inline admin for videos within course admin."""
    
    model = Video
    extra = 1
    fields = ('title', 'video_url', 'duration', 'order')


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    """Admin for Course model."""

    list_display = ('title', 'category', 'duration', 'video_count', 'is_published', 'created_at', 'price')
    list_filter = ('is_published', 'category', 'created_at')
    search_fields = ('title', 'description')
    inlines = [VideoInline]
    
    fieldsets = (
        ('Course Information', {
            'fields': ('title', 'description', 'thumbnail', 'thumbnail_url', 'category', 'duration', 'duration_in_days', 'price')
        }),
        ('Publishing', {
            'fields': ('is_published',)
        }),
    )


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    """Admin for Video model."""
    
    list_display = ('title', 'course', 'duration', 'order', 'created_at')
    list_filter = ('course', 'created_at')
    search_fields = ('title', 'course__title')
    list_editable = ('order',)


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    """Admin for Enrollment model."""
    
    list_display = ('user', 'course', 'progress', 'enrolled_at')
    list_filter = ('enrolled_at', 'course')
    search_fields = ('user__email', 'course__title')
    
    fieldsets = (
        ('Enrollment Details', {
            'fields': ('user', 'course', 'progress', 'last_watched')
        }),
    )


@admin.register(PDF)
class PDFAdmin(admin.ModelAdmin):
    """Admin for PDF model."""
    
    list_display = ('title', 'course', 'order', 'created_at')
    list_filter = ('course', 'created_at')
    search_fields = ('title', 'course__title')
    list_editable = ('order',)


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    """Admin for Certificate model."""
    
      
    # Fields that can't be edited manually
    readonly_fields = ( 'issue_date',)

    # Columns to show in the list view
    list_display = ( 'user', 'course', 'issue_date')

    # Filters on the right sidebar
    list_filter = ('issue_date', 'course')

    # Order newest first
    ordering = ('-issue_date',)

    # Optional: search bar for easier lookup
    search_fields = ( 'user__username', 'course__title')


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    """Admin for Feedback model."""
    
    list_display = ('user', 'course', 'rating', 'created_at')
    list_filter = ('rating', 'created_at', 'course')
    search_fields = ('user__email', 'course__title', 'comment')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Feedback Details', {
            'fields': ('user', 'course', 'rating', 'comment')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(ReviewPhoto)
class ReviewPhotoAdmin(admin.ModelAdmin):
    """Admin for ReviewPhoto model."""
    
    list_display = ('title', 'show_on_homepage', 'order', 'uploaded_at')
    list_filter = ('show_on_homepage', 'uploaded_at')
    search_fields = ('title',)
    list_editable = ('show_on_homepage', 'order')
    readonly_fields = ('uploaded_at',)
    
    fieldsets = (
        ('Review Photo Information', {
            'fields': ('title', 'image', 'show_on_homepage', 'order')
        }),
        ('Timestamps', {
            'fields': ('uploaded_at',)
        }),
    )