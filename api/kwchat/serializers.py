from rest_framework import serializers
from .models import User, Connection

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
            'userid',
            'username',
            'email',
            'thumbnail',
        ]

class SearchSerializer(UserSerializer):
	status = serializers.SerializerMethodField()

	class Meta:
		model = User
		fields = [
			'userid',
			'username',
			'thumbnail',
			'status'
		]
	
	def get_status(self, obj):
		if obj.pending_them:
			return 'pending-them'
		elif obj.pending_me:
			return 'pending-me'
		elif obj.connected:
			return 'connected'
		return 'no-connection'

class RequestSerializer(serializers.ModelSerializer):
	sender = UserSerializer()
	receiver = UserSerializer()

	class Meta:
		model = Connection
		fields = [
			'id',
			'sender',
			'receiver',
			'created'
		]