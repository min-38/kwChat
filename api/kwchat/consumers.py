import base64
import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.core.files.base import  ContentFile
from django.db.models import Q, Exists, OuterRef
from django.db.models.functions import Coalesce

from .models import User, Connection, Message

from .serializers import UserSerializer

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
		# print('receive', json.dumps(data, indent=2))

		# Thumbnail upload
		if data_source == 'thumbnail':
			self.receive_thumbnail(data)

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
