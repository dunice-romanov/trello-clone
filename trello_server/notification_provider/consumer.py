import logging

from channels import Group
from channels.auth import channel_session_user_from_http

from .jwt_decorators import (
    jwt_request_parameter, jwt_message_text_field
)

logger = logging.getLogger(__name__)


# Connected to websocket.connect
# @channel_session_user_from_http
@jwt_request_parameter
def websocket_connect(message):
    print('ws connect')
    message.reply_channel.send({"accept": True})
    user = message.user.username
    print(type(message.user), message.user)
    Group('user').add(message.reply_channel)

# Connected to websocket.disconnect
def websocket_disconnect(message):
    print('fdfd')
    Group('user').discard(message.reply_channel)
    print('ws disconnect')