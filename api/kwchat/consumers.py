import base64
import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.core.files.base import  ContentFile
from django.db.models import Q, Exists, OuterRef
from django.db.models.functions import Coalesce

from .models import User, Connection, Message

from .serializers import UserSerializer, SearchSerializer, RequestSerializer

class ChatConsumer(WebsocketConsumer):

	def connect(self):
		user = self.scope['user']
		# print(user, user.is_authenticated)
		if not user.is_authenticated:
			return
		
		self.userid = user.userid
		# self.userid = user.userid

		# Join this user to a group with their username
		async_to_sync(self.channel_layer.group_add)(
			self.userid, self.channel_name
			# self.userid, self.channel_name
		)
		self.accept()

	def disconnect(self, close_code):
		# Leave room/group
		async_to_sync(self.channel_layer.group_discard)(
			self.userid, self.channel_name
			# self.userid, self.channel_name
		)

	#-----------------------
	#    Handle requests
	#-----------------------

	def receive(self, text_data):
		data = json.loads(text_data)
		data_source = data.get('source')

		# Pretty print  python dict
		print('receive', json.dumps(data, indent=2))

		# 유저 검색 / 유저 필터링
		if data_source == 'search':
			self.receive_search(data)
		# 친구 요청 수락
		elif data_source == 'request.accept':
			self.receive_request_accept(data)
		# 친구 요청
		elif data_source == 'request.connect':
			self.receive_request_connect(data)
		# 친구 요청 리스트
		elif data_source == 'request.list':
			self.receive_request_list(data)
		# 프로필 사진 업로드
		elif data_source == 'thumbnail':
			self.receive_thumbnail(data)

	def receive_request_accept(self, data):
		userid = data.get('userid')
		# Fetch connection object
		try:
			connection = Connectino.objects.get(
				sender_userid=userid,
				receiver=self.scope['user']
			)
		except Connection.DoesNotExist:
			print('Error: connection doesn\'t exists')
			return
		# Update the connection
		connection.accepted = True
		connection.save()

		serialized = RequestSerializer(connection)
		# Send accepted request to sender
		self.send_group(
			connection.sender.userid, 'request.accept', serialized.data
		)
		
		# Send back to sender
		self.send_group(
			connection.sender.userid, 'request.connect', serialized.data
		)
		# Send to receiver
		self.send_group(
			connection.receiver.userid, 'request.connect', serialized.data
		)

	def receive_request_connect(self, data):
		userid = data.get('userid')
		# Attempt to fetch the receiving user
		try:
			receiver = User.objects.get(userid=userid)
		except User.DoesNotExist:
			print('Error: User not found')
			return
		# Create connection
		connection, _ = Connection.objects.get_or_create(
			sender=self.scope['user'],
			receiver=receiver
		)
		# Serialized connection
		serialized = RequestSerializer(connection)
		# Send back to sender
		self.send_group(
			connection.sender.userid, 'request.connect', serialized.data
		)
		# Send to receiver
		self.send_group(
			connection.receiver.userid, 'request.connect', serialized.data
		)

	def receive_request_list(self, data):
		user = self.scope['user']
		# 이 유저에 대한 모든 연결을 가져옴
		connections = Connection.objects.filter(
			receiver=user,
			accepted=False
		)
		serialized = RequestSerializer(connections, many=True)
		
		self.send_group(user.userid, 'request.list', serialized.data)

	def receive_search(self, data):
		query = data.get('query')
		# 쿼리로 유저 가져옴
		users = User.objects.filter(
			Q(userid__istartswith=query)   |
			Q(username__istartswith=query)
		).exclude(
			userid=self.userid
		).annotate(
			pending_them=Exists(
				Connection.objects.filter(
					sender=self.scope['user'],
					receiver=OuterRef('id'),
					accepted=False
				)
			),
			pending_me=Exists(
				Connection.objects.filter(
					receiver=OuterRef('id'),
					sender=self.scope['user'],
					accepted=False
				)
			),
			connected=Exists(
				Connection.objects.filter(
					Q(sender=self.scope['user'], receiver=OuterRef('id')) | 
					Q(receiver=self.scope['user'], sender=OuterRef('id')),
					accetped=True
				)
			),
		)

		# serialize results
		serialized = SearchSerializer(users, many=True)
		# Send search results back to this user
		self.send_group(self.userid, 'search', serialized.data)

	def receive_thumbnail(self, data):
		user = self.scope['user']

		image_str = data.get('base64')
		image = ContentFile(base64.b64decode(image_str))

		# DB thumbnail 업데이트
		filename = data.get('filename')
		user.thumbnail.save(filename, image, save=True)

		# Serialize user
		serialized = UserSerializer(user)

		# send updated user data including new thumbnail
		self.send_group(self.userid, 'thumbnail', serialized.data)

	#--------------------------------------------
	#   Catch/all broadcast to client helpers
	#--------------------------------------------

	def send_group(self, group, source, data):
		response = {
			'type': 'broadcast_group',
			'source': source,
			'data': data
		}
		async_to_sync(self.channel_layer.group_send)(
			group, response
		)

	def broadcast_group(self, data):
		'''
		data:
			- type: 'broadcast_group'
			- source: where it originated from
			- data: what ever you want to send as a dict
		'''
		data.pop('type')
		'''
		return data:
			- source: where it originated from
			- data: what ever you want to send as a dict
		'''
		self.send(text_data=json.dumps(data))
