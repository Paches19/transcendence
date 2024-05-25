import contextlib
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from game.models import MatchRemote
import asyncio

class PongConsumerSingle(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.room_name = "game_room"
        self.room_group_name = f'game_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        # Initialize game state
        self.game_state = {
            'ball_position': [50, 50],  # Example initial position
            'ball_velocity': [choice([-1, 1]), choice([-1, 1])],  # Random initial direction
            'paddle1_position': 50,
            'paddle2_position': 50,
            'score': [0, 0]
        }

        # Start game loop
        asyncio.create_task(self.game_loop())

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        player = data['player']
        direction = data['direction']

        if player == 1:
            if direction == 'up':
                self.game_state['paddle1_position'] = max(0, self.game_state['paddle1_position'] - 5)
            elif direction == 'down':
                self.game_state['paddle1_position'] = min(100, self.game_state['paddle1_position'] + 5)
        elif player == 2:
            if direction == 'up':
                self.game_state['paddle2_position'] = max(0, self.game_state['paddle2_position'] - 5)
            elif direction == 'down':
                self.game_state['paddle2_position'] = min(100, self.game_state['paddle2_position'] + 5)

    async def game_loop(self):
        while True:
            self.update_ball_position()
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_state',
                    'game_state': self.game_state
                }
            )
            await asyncio.sleep(0.03)  # 30ms for ~33 FPS

    def update_ball_position(self):
        ball_x, ball_y = self.game_state['ball_position']
        vel_x, vel_y = self.game_state['ball_velocity']

        # Update ball position
        ball_x += vel_x
        ball_y += vel_y

        # Check for collisions with walls
        if ball_y <= 0 or ball_y >= 100:
            vel_y = -vel_y

        # Check for collisions with paddles
        if ball_x <= 0:  # Left wall (Paddle 1)
            if self.game_state['paddle1_position'] - 10 <= ball_y <= self.game_state['paddle1_position'] + 10:
                vel_x = -vel_x
            else:
                self.game_state['score'][1] += 1  # Player 2 scores
                self.reset_ball()
        elif ball_x >= 100:  # Right wall (Paddle 2)
            if self.game_state['paddle2_position'] - 10 <= ball_y <= self.game_state['paddle2_position'] + 10:
                vel_x = -vel_x
            else:
                self.game_state['score'][0] += 1  # Player 1 scores
                self.reset_ball()

        self.game_state['ball_position'] = [ball_x, ball_y]
        self.game_state['ball_velocity'] = [vel_x, vel_y]

    def reset_ball(self):
        self.game_state['ball_position'] = [50, 50]
        self.game_state['ball_velocity'] = [choice([-1, 1]), choice([-1, 1])]

    async def game_state(self, event):
        await self.send(text_data=json.dumps(event['game_state']))


class PongConsumerPairs(AsyncJsonWebsocketConsumer):
    
    async def connect(self):
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
            #print(matchGroup)
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
        #print(content)
        if (content['event'] == "game_update"):
            for channel_name in self.channel_layer.groups[self.group_name]:
                await self.channel_layer.send(channel_name, {
                    "type": "gameData.send",
                    "data": {
                        "event": "game_update",
                        "stateMatch": content['stateMatch'],
                    }
			    })
        elif(content['event'] == "game_over"):
            for channel_name in self.channel_layer.groups[self.group_name]:
                await self.channel_layer.send(channel_name, {
					"type": "gameData.send",
					"data": {
						"event": "game_over",
						"winner": content['winner'],
					}
				})

        elif(content['event'] == "write_names"):
            for channel_name in self.channel_layer.groups[self.group_name]:
                await self.channel_layer.send(channel_name, {
					"type": "gameData.send",
					"data": {
						"event": "write_names",
						"name1": content['name1'],
						"name2": content['name2'],
                        "ballvy": content['ballvy'],
					}
				})

    async def disconnect(self, code):
        if(code==1):
            return 
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        await self.channel_layer.group_send(self.group_name, {
            "type": "gameData.send",
            "data": {
                "event": "opponent_left",
            }
        })
        match = MatchRemote.objects.get(id=self.match_id)
        match.delete()

    async def gameData_send(self, context):
        await self.send_json(context['data'])
