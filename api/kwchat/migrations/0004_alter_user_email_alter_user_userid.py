# Generated by Django 4.2.7 on 2023-11-08 17:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kwchat', '0003_alter_user_email_alter_user_username'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(error_messages={'unique': '이미 해당 이메일로 등록된 아이디가 있습니다.'}, max_length=254, unique=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='userid',
            field=models.CharField(error_messages={'unique': '이미 존재하는 아이디입니다.'}, max_length=50, unique=True),
        ),
    ]
