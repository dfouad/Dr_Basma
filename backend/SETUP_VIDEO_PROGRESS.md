# Video Progress Tracking Setup Guide

This guide explains the video progress tracking feature that was added to the course platform.

## Overview

The video progress tracking feature allows the system to:
- Track which videos each user has watched in their enrolled courses
- Automatically update enrollment progress (0-100%) based on watched videos
- Display visual indicators (checkmarks) for watched videos
- Show real-time progress updates as users watch videos

## Backend Changes

### 1. Database Model

A new `WatchedVideo` model was added to `backend/courses/models.py`:

```python
class WatchedVideo(models.Model):
    """Model to track which videos a user has watched in their enrollment."""
    
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name='watched_videos')
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    watched_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('enrollment', 'video')
        ordering = ['watched_at']
```

### 2. Enrollment Model Updates

The `Enrollment` model now includes a method to automatically calculate progress:

```python
def update_progress(self):
    """Calculate and update progress based on watched videos."""
    total_videos = self.course.videos.count()
    if total_videos == 0:
        self.progress = 0
    else:
        watched_count = self.watched_videos.count()
        self.progress = int((watched_count / total_videos) * 100)
    self.save()
```

### 3. API Endpoint

A new endpoint was added to mark videos as watched:

**Endpoint:** `POST /api/courses/{course_id}/videos/{video_id}/watch/`

**Authentication:** Required

**Response:**
```json
{
  "message": "Video marked as watched",
  "progress": 75,
  "is_new": true
}
```

### 4. Serializer Updates

The `EnrollmentSerializer` now includes:
- `watched_video_ids`: List of video IDs the user has watched

## Frontend Changes

### 1. CourseDetail Page

**Features added:**
- Fetches enrollment data including watched video IDs
- Automatically marks videos as watched when selected
- Shows checkmark icon for watched videos
- Shows play icon for unwatched videos
- Displays toast notification when a video is marked as watched

**Key functions:**
```typescript
const handleVideoSelect = async (video: Video) => {
  setSelectedVideo(video);
  
  // Mark video as watched if not already watched
  if (enrolled && !watchedVideoIds.includes(video.id)) {
    const response = await videosAPI.markVideoWatched(courseId, video.id);
    // Update local state and show progress
  }
};
```

### 2. Profile Page

The profile page now displays accurate progress based on watched videos for each enrolled course.

## Migration

To apply the database changes, run:

```bash
cd backend
python manage.py migrate courses
```

## Testing

### Test the feature:

1. **Enroll in a course** (if not already enrolled)
2. **Open the course detail page**
3. **Click on a video** to watch it
4. **Observe:**
   - The video should show a checkmark icon after selection
   - A toast notification should appear showing updated progress
   - The progress bar should update on the profile page

### Verify in admin:

1. Log in to Django admin
2. Check the `WatchedVideo` records
3. Verify enrollment progress percentages

## Progress Calculation

Progress is calculated as:
```
progress = (watched_videos_count / total_videos_count) × 100
```

For example:
- Course has 10 videos
- User watched 3 videos
- Progress = (3 / 10) × 100 = 30%

## Important Notes

1. **Unique Tracking:** Each video can only be marked as watched once per enrollment
2. **Automatic Updates:** Progress updates automatically when a video is watched
3. **Real-time Feedback:** Users see immediate visual feedback (checkmarks, progress)
4. **Last Watched:** The `last_watched` field in enrollment is updated with the most recent video
5. **Idempotent:** Clicking the same video multiple times won't create duplicate records

## API Usage Examples

### Mark video as watched:
```javascript
await videosAPI.markVideoWatched(courseId, videoId);
```

### Get enrollment with watched videos:
```javascript
const enrollments = await enrollmentsAPI.getAll();
// Each enrollment includes watched_video_ids array
```

## Troubleshooting

### Videos not being marked as watched:
1. Ensure user is enrolled in the course
2. Check authentication token is valid
3. Verify course_id and video_id are correct
4. Check browser console for errors

### Progress not updating:
1. Verify migration was applied
2. Check that videos exist in the course
3. Ensure `update_progress()` is being called

### Watched status not showing:
1. Refresh enrollment data from API
2. Check that `watched_video_ids` is being fetched
3. Verify the video ID comparison logic
