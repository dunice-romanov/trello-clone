from channels.routing import route
from notification_provider.consumer import ws_message

channel_routing = [
    route("websocket.receive", ws_message),
]