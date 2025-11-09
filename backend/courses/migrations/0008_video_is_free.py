# Generated migration for adding is_free field to Video model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0007_alter_video_course'),
    ]

    operations = [
        migrations.AddField(
            model_name='video',
            name='is_free',
            field=models.BooleanField(default=False, help_text='Mark video as free for public access'),
        ),
    ]
