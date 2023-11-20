from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db import connection
from django.db import transaction
from django.utils import timezone

def upload_thumbnail(instance, filename):
	path = f'thumbnails/{instance.username}'
	extension = filename.split('.')[-1]
	if extension:
		path = path + '.' + extension
	return path

class User(AbstractUser):
	USERNAME_FIELD = 'userid'
	thumbnail = models.ImageField(
		upload_to=upload_thumbnail,
		null=True,
		blank=True
	)
	userid = models.CharField(
		max_length=50,
		unique=True,
		error_messages={
			"unique": ("이미 존재하는 아이디입니다."),
        },
	)
	gender = models.PositiveSmallIntegerField(
		default=0 # 0가 남자
	)
	email = models.EmailField(
        unique=True,
		error_messages={
			"unique": ("이미 해당 이메일로 등록된 아이디가 있습니다."),
        },
    )
	username = models.CharField(
        max_length=150,
		unique=False,
	
    )


class Connection(models.Model):
	sender = models.ForeignKey(
		User,
		related_name='sent_connections',
		on_delete=models.CASCADE
	)
	receiver = models.ForeignKey(
		User,
		related_name='received_connections',
		on_delete=models.CASCADE
	)
	accepted = models.BooleanField(default=False)
	updated = models.DateTimeField(auto_now=True)
	created = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.sender.userid + ' -> ' + self.receiver.userid

class Friend(models.Model):
	def insertFriend(sender_id, receive_id):
		cursor = connection.cursor()
		cursor.execute("INSERT IGNORE INTO kwchat_friend (userid, friendid) VALUES (%s, %s)", [sender_id, receive_id])

		connection.commit()
		connection.close()

	def getFriends(user_id):
		cursor = connection.cursor()
		cursor.execute(
			"""
				SELECT
					userid, username, email, thumbnail
				FROM
					kwchat_user kcu
				WHERE
					kcu.id in ((SELECT friendid FROM kwchat_friend where userid = %s))""", [user_id]
		)
		datas = cursor.fetchall()

		connection.commit()
		connection.close()

		friends = []
		for data in datas:
			row = {
				'userid': data[0],
				'username': data[1],
				'email': data[2],
				'thumbnail': data[3],
			}
			friends.append(row)

		return friends

class Message(models.Model):
	connection = models.ForeignKey(
		Connection,
		related_name='messages',
		on_delete=models.CASCADE
	)
	user = models.ForeignKey(
		User,
		related_name='my_messages',
		on_delete=models.CASCADE
	)
	text = models.TextField()
	created = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.user.userid + ': ' + self.text
	
class Memo(models.Model):
	def load(writer_id, connection_id):
		cursor = connection.cursor()
		cursor.execute("""
				SELECT
					title, content, updated_at
				FROM
					kwchat_memo	
				WHERE
					writer_id = %s
				AND
					connection_id = %s
				""", [writer_id, connection_id])
		data = cursor.fetchone()

		connection.commit()
		connection.close()

		memo = None

		print(data)

		if data:
			memo = {
				'title': data[0],
				'content': data[1],
				'updated_at': str(data[2])
			}
		else:
			memo = {
				'title': "",
				'content': "",
				'updated_at': "",
			}

		return memo

	def save(writer_id, connection_id, title, content):
		cursor = connection.cursor()
		cursor.execute("""
				INSERT INTO
					kwchat_memo
						(writer_id, connection_id, title, content)
				VALUES (%s, %s, %s, %s)
				ON DUPLICATE KEY UPDATE title=%s, content=%s;
				""", [writer_id, connection_id, title, content, title, content])

		connection.commit()
		connection.close()