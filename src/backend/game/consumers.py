import json, asyncio, contextlib, random
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import GameStatus

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
            v = 10,
            key = 'up1',
			ballWidth = 10,
			ballHeight  = 10,
			playerWidth = 15,
			playerHeight = 80,
			finalScore = 3,
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
            boundX = 0,
            boundY = 0,
            state = 'start',
            modality = 'local'
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
            self.game_state.state = state
            keyboard = data['match']['key']

            if state == 'quit':
                await self.close()
                
            elif state == 'start':
                self.reset_game(data['match'])
                self.game_state.state = 'playing'
                asyncio.create_task(self.game_loop())

            elif state == 'playing':
                print("Recibida la tecla "+ keyboard)
                if keyboard == 'up1':
                    self.game_state.y1 = max(0, self.game_state.y1 - self.game_state.v)
                elif keyboard == 'up2':
                    self.game_state.y2 = max(0, self.game_state.y2 - self.game_state.v)
                elif keyboard == 'down1':
                    self.game_state.y1 = min(self.game_state.boundY - self.game_state.playerHeight, self.game_state.y1 + self.game_state.v)
                elif keyboard == 'down2':
                    self.game_state.y2 = min(self.game_state.boundY - self.game_state.playerHeight, self.game_state.y2 + self.game_state.v)   

            elif state == 'reset':
                self.reset_game(data['match'])
                self.game_state.state = 'start'

    async def game_loop(self):
        level = random.randint(3, 8)
        print("Nivel de dificultad: "+ str(level))
        while self.game_state.state != 'gameover' and self.game_state.state != 'quit':
            if (self.game_state.state == 'playing'):
                self.update_ball_position()
                if (self.game_state.modality == 'solo'):
                    self.player2_is_AI(level)
                await self.channel_layer.group_send( self.room_group_name, {
                   	"type": "gameState.send",
                	"data": {
						"event": "game_update",
                    	"stateMatch": self.serialize_game_state()
					}
				})
            await asyncio.sleep(0.03)  # 30ms for ~33 FPS

    def player2_is_AI(self, level):
       if (self.game_state.ballX > (self.game_state.boundX // 2 - level * 25)):
          if (self.game_state.ballY > (self.game_state.y2 + self.game_state.playerHeight)) :
             self.game_state.y2 = min(self.game_state.boundY, self.game_state.y2 + level)
          else:
             self.game_state.y2 = max(0, self.game_state.y2 - level)


    def update_ball_position(self):
        ballX = self.game_state.ballX
        ballY = self.game_state.ballY
        ballSpeedX = self.game_state.ballSpeedX
        ballSpeedY = self.game_state.ballSpeedY
        y1 = self.game_state.y1
        y2 = self.game_state.y2
        x1 = self.game_state.x1
        x2 = self.game_state.x2
        width = self.game_state.boundX
        height = self.game_state.boundY
        paddleWidth = self.game_state.playerWidth
        paddleHeight = self.game_state.playerHeight
        ballWidth = self.game_state.ballWidth
        ballHeight = self.game_state.ballHeight

	    # Update ball position
        if (ballY + ballSpeedY <= 0 or ballY + ballSpeedY >= height):
           ballSpeedY = -ballSpeedY
        ballX += ballSpeedX
        ballY += ballSpeedY

	    # Check for collisions with walls
        # Left wall (Paddle 1)
        if ballX <= x1:
              self.game_state.score2 += 1
              if self.game_state.score2 == self.game_state.finalScore:
                 self.game_state.state = 'gameover'
              else:
                 ballX = width // 2 - ballWidth // 2	
                 ballY = height // 2 - ballHeight // 2

		# Right wall (Paddle 2)
        elif ballX >= x2 + paddleWidth:
              self.game_state.score1 += 1  # Player 1 scores
              if self.game_state.score1 == self.game_state.finalScore:
                 self.game_state.state = 'gameover'
              else:
                 ballX = width // 2 - ballWidth // 2
                 ballY = height // 2 - ballHeight // 2

        elif ((ballY <= y2 + paddleHeight and ballY >= y2 and ballX + ballWidth >= x2) or
	  		  (ballY <= y1 + paddleHeight and ballY >= y1 and ballX - paddleWidth <= x1 )):
                  ballSpeedX = -ballSpeedX
                  if (ballX > x1 and ballX < x1 + paddleWidth):
                         ballX = x1 + paddleWidth + 1

                  if(ballX > x2 and ballX < x2 + paddleWidth):
                         ballX = x2 - ballWidth - 1

                  if((ballY > y1 + paddleHeight * 0.75 or ballY > y2 + paddleHeight * 0.75) and ballSpeedY < 3):
                         ballSpeedY += 1

                  if((ballY < y1 + paddleHeight * 0.25 or ballY < y2 + paddleHeight * 0.25) and ballSpeedY > -3):
                         ballSpeedY -= 1
        self.game_state.ballX = ballX
        self.game_state.ballY = ballY
        self.game_state.ballSpeedX = ballSpeedX
        self.game_state.ballSpeedY = ballSpeedY

    def reset_game(self, match):
        self.game_state = GameStatus(
            v = match['v'],
            key = match['key'],
			ballWidth = match['ballWidth'],
			ballHeight  = match['ballHeight'],
			playerWidth = match['playerWidth'],
			playerHeight = match['playerHeight'],
			finalScore = match['finalScore'],
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
            boundX= match['boundX'],
            boundY= match['boundY'],
            state = match['state'],
            modality = match['modality']
        )

    def serialize_game_state(self):
        return {
            'v': self.game_state.v,
            'key': self.game_state.key,
            'ballWidth': self.game_state.ballWidth,
            'ballHeight': self.game_state.ballHeight,
            'playerWidth': self.game_state.playerWidth,
            'playerHeight': self.game_state.playerHeight,
            'finalScore': self.game_state.finalScore,
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
            'boundX': self.game_state.boundX,
            'boundY': self.game_state.boundY,
            'state': self.game_state.state,
            'modality': self.game_state.modality
        }

    async def gameState_send(self, event):
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
				v = 10,
				ballWidth = 10,
				ballHeight  = 10,
				playerWidth = 15,
				playerHeight = 80,
				finalScore = 3,
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
				boundX = 0,
				boundY = 0,
            	state = 'start', 
				modality = 'remote'
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
