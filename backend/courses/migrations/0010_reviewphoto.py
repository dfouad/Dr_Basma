# Generated migration for ReviewPhoto model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0009_feedback'),
    ]

    operations = [
        migrations.CreateModel(
            name='ReviewPhoto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('image', models.ImageField(upload_to='reviews/')),
                ('show_on_homepage', models.BooleanField(default=False)),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('order', models.IntegerField(default=0)),
            ],
            options={
                'ordering': ['order', '-uploaded_at'],
            },
        ),
    ]
