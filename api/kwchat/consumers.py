import base64
import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.core.files.base import  ContentFile
from django.db.models import Q, Exists, OuterRef
from django.db.models.functions import Coalesce

from .models import User, Connection, Message

from .serializers import (
	UserSerializer, 
)

class ChatConsumer(WebsocketConsumer):

	def connect(self):
		user = self.scope['user']
		print(user, user.is_authenticated)
		if not user.is_authenticated:
			return
		# Save username to use as a group name for this user
		self.username = user.username
		# self.userid = user.userid

		# Join this user to a group with their username
		async_to_sync(self.channel_layer.group_add)(
			self.username, self.channel_name
			# self.userid, self.channel_name
		)
		self.accept()

	def disconnect(self, close_code):
		# Leave room/group
		async_to_sync(self.channel_layer.group_discard)(
			self.username, self.channel_name
			# self.userid, self.channel_name
		)

	#-----------------------
	#    Handle requests
	#-----------------------

	def receive(self, text_data):
		data = json.loads(text_data)

		print('receive', json.dumps(data, index=2))