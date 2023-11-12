from rest_framework import serializers
from .models import User, Connection, Message

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
        userid   = validated_data['userid'].lower() # 유저 아이디
        username = validated_data['username'].lower() # 유저 이름
        email = validated_data['email'].lower() # 유저 이메일

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

class FriendSerializer(serializers.ModelSerializer):
	friend = serializers.SerializerMethodField()
	preview = serializers.SerializerMethodField()
	updated = serializers.SerializerMethodField()
	
	class Meta:
		model = Connection
		fields = [
			'id',
			'friend',
			'preview',
			'updated'
		]


	def get_friend(self, obj):
		# If Im the sender
		if self.context['user'] == obj.sender:
			return UserSerializer(obj.receiver).data
		# If Im the receiver
		elif self.context['user'] == obj.receiver:
			return UserSerializer(obj.sender).data
		else:
			print('Error: No user found in friendserializer')


	def get_preview(self, obj):
		default = '(대화 기록 없음)'
		if not hasattr(obj, 'latest_text'):
			return default
		return obj.latest_text or default


	def get_updated(self, obj):
		if not hasattr(obj, 'latest_created'):
			date = obj.updated
		else:
			date = obj.latest_created or obj.updated
		return date.isoformat()

class MessageSerializer(serializers.ModelSerializer):
	is_me = serializers.SerializerMethodField()

	class Meta:
		model = Message
		fields = [
			'id',
			'is_me',
			'text',
			'created'
		]

	def get_is_me(self, obj):
		return self.context['user'] == obj.user