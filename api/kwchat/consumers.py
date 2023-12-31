import base64
import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.core.files.base import  ContentFile
from django.db.models import Q, Exists, OuterRef
from django.db.models.functions import Coalesce

from datetime import datetime

from .models import User, Connection, Message, Friend, Memo

from .serializers import (
	UserSerializer,
	SearchSerializer,
	RequestSerializer,
	FriendSerializer,
	MessageSerializer
)

class ChatConsumer(WebsocketConsumer):

	def connect(self):
		user = self.scope['user']
		# print(user, user.is_authenticated)
		if not user.is_authenticated:
			return
		
		self.userid = user.userid

		# Join this user to a group with their userid
		async_to_sync(self.channel_layer.group_add)(
			self.userid, self.channel_name
		)
		self.accept()

	def disconnect(self, close_code):
		# Leave room/group
		async_to_sync(self.channel_layer.group_discard)(
			self.userid, self.channel_name
		)

	#-----------------------
	#    Handle requests
	#-----------------------

	def receive(self, text_data):
		data = json.loads(text_data)
		data_source = data.get('source')

		# Pretty print  python dict
		print('receive', json.dumps(data, indent=2))

		# 친구 요청 수락
		if data_source == 'friend.list':
			self.receive_friend_list(data)
			# self.get_friend_list(data)
		# 메세지 목록
		elif data_source == 'message.list':
			self.receive_message_list(data)
		# 메세지 전송
		elif data_source == 'message.send':
			self.receive_message_send(data)
		# 유저가 메시지를 작성하고 있을 때
		elif data_source == 'message.type':
			self.receive_message_type(data)
		# 메모 불러오기
		elif data_source == 'memo.get':
			self.load_memo(data)
		# 메모 저장
		elif data_source == 'memo.save':
			self.save_memo(data)
		# 친구 요청 수락
		elif data_source == 'request.accept':
			self.receive_request_accept(data)
		# 친구 요청
		elif data_source == 'request.connect':
			self.receive_request_connect(data)
		# 친구 요청 리스트
		elif data_source == 'request.list':
			self.receive_request_list(data)
		# 유저 검색 / 유저 필터링
		elif data_source == 'search':
			self.receive_search(data)
		# 프로필 사진 업로드
		elif data_source == 'thumbnail':
			self.receive_thumbnail(data)

	def receive_friend_list(self, data):
		user = self.scope['user']
		# Latest message subquery
		latest_message = Message.objects.filter(
			connection=OuterRef('id')
		).order_by('-created')[:1]
		# Get connections for user
		connections = Connection.objects.filter(
			Q(sender=user) | Q(receiver=user),
			accepted=True
		).annotate(
			latest_text   =latest_message.values('text'),
			latest_created=latest_message.values('created')
		).order_by(
			Coalesce('latest_created', 'updated').desc()
		)
		serialized = FriendSerializer(
			connections, 
			context={ 
				'user': user 
			}, 
			many=True)
		# Send data back to requesting user
		self.send_group(user.userid, 'friend.list', serialized.data)

	def get_friend_list(self, data):
		user = self.scope['user']
		# Get friend list for user

		friendList = Friend.getFriends(user.id)
		# Send data back to requesting user
		self.send_group(user.userid, 'friend.list', friendList)

	def receive_message_list(self, data):
		user = self.scope['user']
		connectionId = data.get('connectionId')
		page = data.get('page')
		page_size = 15
		try:
			connection = Connection.objects.get(id=connectionId)
		except Connection.DoesNotExist:
			print('Error: couldnt find connection')
			return
		# Get messages
		messages = Message.objects.filter(
			connection=connection
		).order_by('-created')[page * page_size:(page + 1) * page_size]
		# Serialized message
		serialized_messages = MessageSerializer(
			messages,
			context={ 
				'user': user 
			}, 
			many=True
		)
		# Get recipient friend
		recipient = connection.sender
		if connection.sender == user:
			recipient = connection.receiver
		
		# Serialize friend
		serialized_friend = UserSerializer(recipient)

		# Count the total number of messages for this connection
		messages_count = Message.objects.filter(
			connection=connection
		).count()

		next_page = page + 1 if messages_count > (page + 1 ) * page_size else None

		data = {
			'messages': serialized_messages.data,
			'next': next_page,
			'friend': serialized_friend.data
		}
		# Send back to the requestor
		self.send_group(user.userid, 'message.list', data)

	def receive_message_send(self, data):
		user = self.scope['user']
		connectionId = data.get('connectionId')
		message_text = data.get('message')
		try:
			connection = Connection.objects.get(id=connectionId)
		except Connection.DoesNotExist:
			print('Error: couldnt find connection')
			return
		
		message = Message.objects.create(
			connection=connection,
			user=user,
			text=message_text
		)

		# Get recipient friend
		recipient = connection.sender
		if connection.sender == user:
			recipient = connection.receiver

		# Send new message back to sender
		serialized_message = MessageSerializer(
			message,
			context={
				'user': user
			}
		)
		serialized_friend = UserSerializer(recipient)
		data = {
			'message': serialized_message.data,
			'friend': serialized_friend.data
		}
		self.send_group(user.userid, 'message.send', data)

		# Send new message to receiver
		serialized_message = MessageSerializer(
			message,
			context={
				'user': recipient
			}
		)
		serialized_friend = UserSerializer(user)
		data = {
			'message': serialized_message.data,
			'friend': serialized_friend.data
		}
		self.send_group(recipient.userid, 'message.send', data)


	def receive_message_type(self, data):
		user = self.scope['user']
		recipient_userid = data.get('userid')
		data = {
			'userid': user.userid
		}
		self.send_group(recipient_userid, 'message.type', data)
	
	def load_memo(self, data):
		user = self.scope['user']
		memo = Memo.load(user.id, data.get('connectionid'))
		self.send_group(user.userid, 'memo.get', memo)

	def save_memo(self, data):
		user = self.scope['user']
		Memo.save(user.id, data.get('connectionid'), data.get('title'), data.get('content'))
		memo = Memo.load(user.id, data.get('connectionid'))
		self.send_group(user.userid, 'memo.save', memo)

	def receive_request_accept(self, data):
		userid = data.get('userid')
		# Fetch connection object
		try:
			connection = Connection.objects.get(
				sender__userid=userid,
				receiver=self.scope['user']
			)
		except Connection.DoesNotExist:
			print('Error: connection doesn\'t exists')
			return
		# Update the connection
		connection.accepted = True
		connection.save()

		try:
			Friend.insertFriend(connection.sender.id, connection.receiver.id)
			Friend.insertFriend(connection.receiver.id, connection.sender.id)
		except Exception as e:
			print(e)

		serialized = RequestSerializer(connection)
		# Send accepted request to sender
		self.send_group(
			connection.sender.userid, 'request.accept', serialized.data
		)
		# Send accepted request to receiver
		self.send_group(
			connection.receiver.userid, 'request.accept', serialized.data
		)

		# Send new friend object to sender
		serialized_friend = FriendSerializer(
			connection,
			context={
				'user': connection.sender
			}
		)
		self.send_group(
			connection.sender.userid, 'friend.new', serialized_friend.data)

		# Send new friend object to receiver
		serialized_friend = FriendSerializer(
			connection,
			context={
				'user': connection.receiver
			}
		)
		self.send_group(
			connection.receiver.userid, 'friend.new', serialized_friend.data)

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
					accepted=True
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
