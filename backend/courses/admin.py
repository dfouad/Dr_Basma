from django.contrib import admin
from .models import Category, Course, Video, Enrollment, PDF, Certificate


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
    
    list_display = ('title', 'category', 'duration', 'video_count', 'is_published', 'created_at')
    list_filter = ('is_published', 'category', 'created_at')
    search_fields = ('title', 'description')
    inlines = [VideoInline]
    
    fieldsets = (
        ('Course Information', {
            'fields': ('title', 'description', 'thumbnail', 'category', 'duration')
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