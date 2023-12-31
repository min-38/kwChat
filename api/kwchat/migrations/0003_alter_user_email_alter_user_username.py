# Generated by Django 4.2.7 on 2023-11-08 17:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kwchat', '0002_user_first_name_user_gender_user_last_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=254, unique=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(max_length=150),
        ),
    ]
