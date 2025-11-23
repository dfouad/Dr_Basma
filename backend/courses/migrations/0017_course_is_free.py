# Generated migration for adding is_free field to Course model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0016_alter_feedback_user_alter_pdf_pdf_file'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='is_free',
            field=models.BooleanField(default=False, help_text='Mark course as free'),
        ),
    ]
