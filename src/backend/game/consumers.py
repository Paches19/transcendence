import contextlib, random
from channels.generic.websocket import AsyncJsonWebsocketConsumer

class PongConsumer(AsyncJsonWebsocketConsumer):
    stateMatch = {
        'player1': 0,
		'player2': 0,
		'ball': {
			'x': 0,
			'y': 0,
			'vx': 0,
			'vy': 0,
		},
		'paddle1': {
			'x': 0,
			'y': 0,
		},
		'paddle2': {
			'x': 0,
			'y': 0,
		},
	}
    
    async def connect(self):
        # Accept the WebSocket connection
        print(self.scope['url_route']['kwargs']['id'])
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
                        "state": self.stateMatch,
                    }
				})

    async def receive_json(self, content, **kwargs):
        print(content)
        return await super().receive_json(content, **kwargs)

    async def disconnect(self, code):
        await super().disconnect(code)
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        

    async def gameData_send(self, event):
        await self.send_json(event['data'])


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
                        "myTurn": True if i==0 else False
                    }
				})

    async def receive_json(self, content, **kwargs):
        print(content)
        return await super().receive_json(content, **kwargs)

    async def disconnect(self, code):
        await super().disconnect(code)
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        

    async def gameData_send(self, event):
        await self.send_json(event['data'])
