from django.contrib.auth.models import AnonymousUser
from django.db.models.signals import post_save
from django.dispatch import receiver

import logging

from redis import Redis

from channels import Group, Channel

from channels.sessions import channel_session
from channels.auth import channel_session_user, channel_session_user_from_http

from posts.models import Notification

from .jwt_decorators import (
    jwt_request_parameter, jwt_message_text_field
)


logger = logging.getLogger(__name__)
redis_conn = Redis("localhost", 6379)

@receiver(post_save, sender=Notification)
def send_update(sender, instance, **kwargs):
    pass
    result = {}
    result['text'] = 'new_notify' 
    username = instance.username.username
    Group(username).send(result)
    print('____ result sended to ', username)



@jwt_request_parameter
def websocket_connect(message):
    print('ws connect')
    hash_name = message.reply_channel.name
    username = message.user.username
    redis_conn.append(str(hash_name), username)
    Group(username).add(message.reply_channel)
    message.reply_channel.send({"accept": True})
    # print('replychannel on connect:______',message.reply_channel.__dict__)


def websocket_message(message):
    print('in message')


def websocket_disconnect(message):
    hash_name = message.reply_channel.name
    username = redis_conn.get(hash_name)
    redis_conn.delete(hash_name)
    Group(username).discard(message.reply_channel)
