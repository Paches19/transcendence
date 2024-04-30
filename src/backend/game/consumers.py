import contextlib, random
from channels.generic.websocket import AsyncJsonWebsocketConsumer

class PongConsumer(AsyncJsonWebsocketConsumer):
    
    async def connect(self):
        # Accept the WebSocket connection
        self.match_id = self.scope['url_route']['kwargs']['id']
        self.group_name = f'group_{self.match_id}'
        await self.channel_layer.group_add(self.group_name, self.channel_name)

        with contextlib.suppress(KeyError):
            if(len(self.channel_layer.groups[self.group_name]) > 2):
                await self.accept()
                await self.send_json({
						"event": "show_error",
						"error": "Match is full"
				})
                return await self.close()

        await self.accept()
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        
        if len(self.channel_layer.groups[self.group_name]) == 2:
            matchGroup = list(self.channel_layer.groups[self.group_name])
            print(matchGroup)
            for i, channel_name in enumerate(matchGroup):
                player_number = "1" if i == 0 else "2"
                await self.channel_layer.send(channel_name, {
					"type": "gameData.send",
                    "data": {
                        "event": "game_start",
                        "player": player_number,
                    }
				})

    async def receive_json(self, content, **kwargs):
        print(content)
        if (content['event'] == "game_update"):
            for channel_name in self.channel_layer.groups[self.group_name]:
                await self.channel_layer.send(channel_name, {
                    "type": "gameData.send",
                    "data": {
                        "event": "game_update",
                        "stateMatch": content['stateMatch'],
                    }
				})

    async def disconnect(self, code):
        await super().disconnect(code)
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        

    async def gameData_send(self, context):
        await self.send_json(context['data'])


class TicTacToeConsumer(AsyncJsonWebsocketConsumer):
    
    board = {
        0: '', 1: '', 2: '',
        3: '', 4: '', 5: '',
        6: '', 7: '', 8: '',
    }

    async def connect(self):
        # Accept the WebSocket connection
        print(self.scope['url_route']['kwargs']['id'])
        self.room_id = self.scope['url_route']['kwargs']['id']
        self.group_name = f'group_{self.room_id}'
        await self.channel_layer.group_add(self.group_name, self.channel_name)

        with contextlib.suppress(KeyError):
            if(len(self.channel_layer.groups[self.group_name]) > 2):
                await self.accept()
                await self.send_json({
						"event": "show_error",
						"error": "Room is full"
				})
                return await self.close()

        await self.accept()
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        
        if len(self.channel_layer.groups[self.group_name]) == 2:
            tmpGroup = list(self.channel_layer.groups[self.group_name])
            first_player = random.choice(tmpGroup)
            tmpGroup.remove(first_player)
            final_group = [first_player, tmpGroup[0]]
            print(final_group)
            for i, channel_name in enumerate(final_group):
                await self.channel_layer.send(channel_name, {
					"type": "gameData.send",
                    "data": {
                        "event": "game_start",
                        "board": self.board,
                        "turn": True if i==0 else False,
                        "symbol": "X" if i==0 else "O",
                    }
				})

    async def receive_json(self, content, **kwargs):
        print(content)
        if (content['event'] == "boardData_send"):
            for channel_name in self.channel_layer.groups[self.group_name]:
                await self.channel_layer.send(channel_name, {
                    "type": "gameData.send",
                    "data": {
                        "event": "boardData_send",
                        "board": content['board'],
                        "turn": False if self.channel_name == channel_name else True,
                    }
				})

    async def disconnect(self, code):
        await super().disconnect(code)
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        

    async def gameData_send(self, context):
        await self.send_json(context['data'])
