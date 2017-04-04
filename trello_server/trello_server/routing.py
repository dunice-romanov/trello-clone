from channels.routing import route
from notification_provider.consumer import websocket_connect, websocket_disconnect

channel_routing = {
    'websocket.connect': websocket_connect,
    'websocket.disconnect': websocket_disconnect
}