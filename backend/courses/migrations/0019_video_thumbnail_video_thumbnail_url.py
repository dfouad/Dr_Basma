# Generated migration for adding thumbnail fields to Video model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0018_merge_0015_alter_pdf_pdf_file_0017_course_is_free'),
    ]

    operations = [
        migrations.AddField(
            model_name='video',
            name='thumbnail',
            field=models.ImageField(blank=True, null=True, upload_to='video_thumbnails/'),
        ),
        migrations.AddField(
            model_name='video',
            name='thumbnail_url',
            field=models.URLField(blank=True, help_text='Alternative to uploading thumbnail file', null=True),
        ),
    ]
