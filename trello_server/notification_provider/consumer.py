from django.contrib.auth.models import AnonymousUser
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

import logging

from redis import Redis

from channels import Group

from posts.models import Notification
from boards.models import BoardPermission

from .jwt_decorators import (
    jwt_request_parameter, jwt_message_text_field
)


UPDATE_BOARDS = 'board_update'
UPDATE_NOTIFICATIONS = 'new_notify'

logger = logging.getLogger(__name__)
redis_conn = Redis("localhost", 6379)

@receiver(post_save, sender=Notification)
def send_update_notification(sender, instance, **kwargs):
    message = create_message(UPDATE_NOTIFICATIONS)
    username = instance.username.username
    Group(username).send(message)


@receiver(post_save, sender=BoardPermission)
def send_update_board_subscribe(sender, instance, **kwargs):
    message = create_message(UPDATE_BOARDS)
    username = instance.user.username
    Group(username).send(message)


@receiver(post_delete, sender=BoardPermission)
def send_board_unsubscribe(sender, instance, **kwargs):
    message = create_message(UPDATE_BOARDS)
    username = instance.user.username
    Group(username).send(message)


@jwt_request_parameter
def websocket_connect(message):
    hash_name = message.reply_channel.name
    username = message.user.username
    redis_conn.append(str(hash_name), username)
    Group(username).add(message.reply_channel)
    message.reply_channel.send({"accept": True})


def websocket_message(message):
    print('in message')


def websocket_disconnect(message):
    hash_name = message.reply_channel.name
    username = redis_conn.get(hash_name)
    redis_conn.delete(hash_name)
    Group(username).discard(message.reply_channel)


def create_message(text):
    result = {}
    result['text'] = text
    return result