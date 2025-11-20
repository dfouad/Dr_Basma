# Generated migration

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0018_merge_0015_alter_pdf_pdf_file_0017_course_is_free'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reviewphoto',
            name='show_on_homepage',
            field=models.BooleanField(default=True, help_text='Show this photo on homepage'),
        ),
    ]
