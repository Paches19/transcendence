import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.generic.websocket import AsyncWebsocketConsumer
from random import choice
import asyncio
from .models import GameStatus
import contextlib

POINTS_TO_WIN = 3	# Number of points to win the game

class PongConsumerLocal(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['name']
        self.room_group_name = f'local_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        print("Se ha conectado el jugador "+ self.room_name)
        # Initialize game state
        self.game_state = GameStatus(
            id = 0,
            x1 = 0,
            y1 = 0,
            score1 = 0,
            name1 = 'Player1',
            x2 = 0,
			y2 = 0,
            score2 = 0,
            name2 = 'Player2',
            ballX = 0,
            ballY = 0,
            ballSpeedX = 0,
            ballSpeedY = 0,
            state = 'start'
        )
 
    async def disconnect(self, code):
        if (code == 1):
            print("Se ha desconectado el jugador "+ self.room_name)
            return
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        if 'event' in data and data['event'] == 'game_state':
            state = data['match']['state']
            modality = data['match']['modality']
            print("Se ha recibido el evento "+ state)
            if state == 'quit':
                self.game_state.state = 'quit'
                await self.close()

            elif state == 'pause':
                self.game_state.state = 'pause'

            elif state == 'start':
                self.reset_game(data['match'])
                asyncio.create_task(self.game_loop())
                self.game_state.state = 'playing'

            elif state == 'playing':
                if state == 'up1':
                    self.game_state.y1 = max(0, self.game_state.y1 - 5)
                elif state == 'up2' and modality == 'local':
                    self.game_state.y2 = max(0, self.game_state.y2 - 5)
                elif state == 'down1':
                    self.game_state.y1 = min(100, self.game_state.y1 + 5)
                elif state == 'down2' and modality == 'local':
                    self.game_state.y2 = min(100, self.game_state.y2 + 5)   
     
            elif state == 'gameover':
                self.game_state.state = 'gameover'

            elif state == 'reset':
                self.reset_game(data['match'])
                self.game_state.state = 'start'

    async def game_loop(self):
        while self.game_state.state != 'gameover' and self.game_state.state != 'quit':
            self.update_ball_position()
            print("Estoy en el bucle del juego")
            await self.channel_layer.group_send( self.room_group_name, {
                "type": "gameState.send",
                "data": {
                    "stateMatch": self.serialize_game_state()
				}
			})
            await asyncio.sleep(0.03)  # 30ms for ~33 FPS

    def update_ball_position(self):
        ballX, ballY = self.game_state.ballX, self.game_state.ballY
        ballSpeedX, ballSpeedY = self.game_state.ballSpeedX, self.game_state.ballSpeedY

        print("Ball position before:", ballX, ballY)
        # Update ball position
        if self.game_state.state == 'playing':
            ballX += ballSpeedX
            ballY += ballSpeedY

        # Check for collisions with walls
        if ballY <= 0 or ballY >= 100:
            ballSpeedY = -ballSpeedY

        # Check for collisions with paddles
        if ballX <= 0:  # Left wall (Paddle 1)
            if self.game_state.y1 - 10 <= ballY <= self.game_state.y1 + 10:
                ballSpeedX = -ballSpeedX
            else:
                self.game_state.score2 += 1  # Player 2 scores
               
                if self.game_state.score2 == POINTS_TO_WIN:
                    self.game_state.state = 'gameover'
        elif ballX >= 100:  # Right wall (Paddle 2)
            if self.game_state.y2 - 10 <= ballY <= self.game_state.y2 + 10:
                ballSpeedX = -ballSpeedX
            else:
                self.game_state.score1 += 1  # Player 1 scores
               
                if self.game_state.score1 == POINTS_TO_WIN:
                    self.game_state.state = 'gameover'

        self.game_state.ballX = ballX
        self.game_state.ballY = ballY
        self.game_state.ballSpeedX = ballSpeedX
        self.game_state.ballSpeedY = ballSpeedY
        print("Ball position after:", ballX, ballY)

    def reset_game(self, match):
        self.game_state = GameStatus(
            id = 0,
            x1 = match['x1'],
            y1 = match['y1'],
            score1 = 0, 
            name1 = match['name1'],
            x2 = match['x2'],
            y2 = match['y2'],
            score2 = 0,
            name2 = match['name2'],
            ballX = match['ballx'],
            ballY = match['bally'],
            ballSpeedX = match['ballvx'],
            ballSpeedY = match['ballvy'],
            state = match['state']
        )

    def serialize_game_state(self):
        return {
            'id': self.game_state.id,
            'x1': self.game_state.x1,
            'y1': self.game_state.y1,
            'score1': self.game_state.score1,
            'name1': self.game_state.name1,
            'x2': self.game_state.x2,
            'y2': self.game_state.y2,
            'score2': self.game_state.score2,
            'name2': self.game_state.name2,
            'ballX': self.game_state.ballX,
            'ballY': self.game_state.ballY,
            'ballSpeedX': self.game_state.ballSpeedX,
            'ballSpeedY': self.game_state.ballSpeedY,
            'state': self.game_state.state
        }

    async def gameState_send(self, event):
        print("Sending game state:", event['data'])
        await self.send(text_data=json.dumps( event['data']))


class PongConsumerRemote(AsyncJsonWebsocketConsumer):
    
    async def connect(self):
        self.match_id = self.scope['url_route']['kwargs']['id']
        self.group_name = f'group_{self.match_id}'
        await self.channel_layer.group_add(self.group_name, self.channel_name)

        # Check if the group already has two players
        with contextlib.suppress(KeyError):
            if len(self.channel_layer.groups[self.group_name]) > 2:
                await self.accept()
                await self.send_json({
                    "event": "show_error",
                    "error": "Match is full"
                })
                return await self.close()

        await self.accept()
        
        if len(self.channel_layer.groups[self.group_name]) == 2:
            matchGroup = list(self.channel_layer.groups[self.group_name])
            for i, channel_name in enumerate(matchGroup):
                player_number = "1" if i == 0 else "2"
                await self.channel_layer.send(channel_name, {
                    "type": "gameData.send",
                    "data": {
                        "event": "game_start",
                        "player": player_number,
                    }
                })

            # Initialize game state
            self.game_state = GameStatus(
                id=self.match_id,
                x1=50, y1=50, score1=0, name1='Player1',
                x2=50, y2=50, score2=0, name2='Player2',
                ballX=50, ballY=50,
                ballSpeedX=choice([-1, 1]), ballSpeedY=choice([-1, 1]),
                state='start'
            )

    async def receive_json(self, content, **kwargs):
        event = content['event']

        if event == "game_update":
            self.game_state = GameStatus(**content['stateMatch'])
            for channel_name in self.channel_layer.groups[self.group_name]:
                await self.channel_layer.send(channel_name, {
                    "type": "gameData.send",
                    "data": {
                        "event": "game_update",
                        "match": content['stateMatch'],
                    }
                })
        elif event == "game_over":
            for channel_name in self.channel_layer.groups[self.group_name]:
                await self.channel_layer.send(channel_name, {
                    "type": "gameData.send",
                    "data": {
                        "event": "game_over",
                        "winner": content['winner'],
                    }
                })
        elif event == "write_names":
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
        if (code == 1):
            return
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        await self.channel_layer.group_send(self.group_name, {
            "type": "gameData.send",
            "data": {
                "event": "opponent_left",
            }
        })

    async def gameData_send(self, context):
        await self.send_json(context['data'])
