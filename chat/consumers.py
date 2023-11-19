import json

from asgiref.sync import async_to_sync, sync_to_async
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import LiveChats, Messages, User

class ChatConsumer(AsyncWebsocketConsumer):

    @database_sync_to_async
    def create_chat(self, msg, sender,room_name):
        chat = LiveChats.objects.get(room_name = room_name)
        user = User.objects.get(username = sender)
        return Messages.objects.create(message = msg, sender = user, chat = chat)

    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name

        #join group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()


    async def disconnect(self, close_code):
        # leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        pass

    #receive message from websocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        username = text_data_json['username']
        room_name = text_data_json["room_name"]

        #send message to the channel
        await self.channel_layer.group_send(
            self.room_group_name, {"type":"chat_message", "message": message,'username':username,'room_name':room_name}
            )

    # receive message from room group
    async def chat_message(self, event):
        message = event["message"]
        username = event['username']
        room_name = event['room_name']
        new_msg = await self.create_chat(message,username,room_name)
        #send message to websocket
        await self.send(text_data = json.dumps({"message": message, 'username':username,'room_name':room_name}))