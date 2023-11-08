from rest_framework import serializers
from .models import User

class SignUpSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = [
            'userid',
            'username',
            'email',
            'password',
        ]
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }
    
    def create(self, validated_data):
        userid   = validated_data['userid'].lower()
        username = validated_data['username'].lower()
        email = validated_data['email'].lower()

        # 유저 생성
        user = User.objects.create(
            userid=userid,
            username=username,
            email=email
        )
        password = validated_data['password']
        user.set_password(password)
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = [
            'userID',
            'username',
            'email',
            'thumbnail',
        ]