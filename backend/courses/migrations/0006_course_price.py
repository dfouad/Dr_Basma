# Generated migration for adding price field to Course model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0005_remove_certificate_certificate_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='price',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='Course price (null or 0 for free courses)', max_digits=8, null=True),
        ),
    ]
