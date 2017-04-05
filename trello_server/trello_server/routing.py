from channels.routing import route
from notification_provider.consumer import websocket_connect, websocket_disconnect, websocket_message

channel_routing = {
    'websocket.connect': websocket_connect,
    'websocket.disconnect': websocket_disconnect,
    'websocket.receive': websocket_message,
}