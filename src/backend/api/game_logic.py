import asyncio, random

game_state = {
   'id': 0,
   'v': 0,
   'key': '',
   'ballWidth': 10,
   'ballHeight': 10,
   'playerWidth': 15,
   'playerHeight': 80,
   'finalScore': 3,
   'x1': 0,
   'y1': 0,
   'score1': 0,
   'name1': 'Player1',
   'x2': 0,
   'y2': 0,
   'score2': 0,
   'name2': 'Player2',
   'ballX': 0,
   'ballY': 0,
   'ballSpeedX': 0,
   'ballSpeedY': 0,
   'boundX': 0,
   'boundY': 0,
   'state': 'waiting',
   'modality': ''
}

def move_paddles(key):
	if key == 'up1':
		game_state['y1'] = max(0, game_state['y1'] - game_state['v'])
	elif key == 'down1':
		game_state['y1'] = min(game_state['boundY'] - game_state['playerHeight'], game_state['y1'] + game_state['v'])
	elif key == 'up2':
		game_state['y2'] = max(0, game_state['y2'] - game_state['v'])
	elif key == 'down2':
		game_state['y2'] = min(game_state['boundY'] - game_state['playerHeight'], game_state['y2'] + game_state['v'])
     
def update_positions():
    # Update ball position
   if game_state['bally'] + game_state['ballvy'] <= 0 or game_state['bally'] + game_state['ballvy'] >= game_state['boundY']:
       game_state['ballvy'] = -game_state['ballvy']
   game_state['ballx'] += game_state['ballvx']
   game_state['bally'] += game_state['ballvy']

  	# Check for collisions with walls
    # Left wall (Paddle 1)
   if (game_state['ballX'] <= game_state['x1']):
      game_state['score2'] += 1
      if (game_state['score2'] == game_state['finalScore']):
         game_state['state'] = 'gameover'
      else:
          game_state['ballX'] = game_state['boundX'] // 2 - game_state['ballWidth'] // 2
          game_state['ballY'] = game_state['boundY'] // 2 - game_state['ballHeight'] // 2

	# Right wall (Paddle 2)
   elif (game_state['ballX'] >= game_state['x2'] + game_state['playerWidth']):
      game_state['score1'] += 1
      if (game_state['score1'] == game_state['finalScore']):
          game_state['state'] = 'gameover'
      else:
          game_state['ballX'] = game_state['boundX'] // 2 - game_state['ballWidth'] // 2
          game_state['ballY'] = game_state['boundY'] // 2 - game_state['ballHeight'] // 2

   # Paddle collisions
   elif ((game_state['ballY'] <= game_state['ballHeight'] + game_state['y2'] and game_state['ballY'] >= game_state['y2'] and game_state['ballX'] + game_state['ballWidth'] >= game_state['x2']) or
	  (game_state['ballY'] <= game_state['ballHeight'] + game_state['y1'] and game_state['ballY'] >= game_state['y1'] and game_state['ballX'] - game_state['ballWidth'] <= game_state['x1'])):
      game_state['ballVX'] = -game_state['ballVX']
      if (game_state['ballX'] > game_state['x1'] and game_state['ballX'] < game_state['x1'] + game_state['playerWidth']):
         game_state['ballX'] = game_state['x1'] + game_state['playerWidth'] + 1

      if (game_state['ballX'] > game_state['x2'] and game_state['ballX'] < game_state['x2'] + game_state['playerWidth']):
         game_state['ballX'] = game_state['x2'] - game_state['ballWidth'] - 1

      if ((game_state['ballY'] > game_state['y1'] + game_state['playerHeight'] * 0.75 or game_state['ballY'] > game_state['y2'] + game_state['playerHeight'] * 0.75) and game_state['ballSpeedY'] < 3):
         game_state['ballSpeedY'] += 1

      if ((game_state['ballY'] < game_state['y1'] + game_state['playerHeight'] * 0.25 or game_state['ballY'] < game_state['y2'] + game_state['playerHeight'] * 0.25) and game_state['ballSpeedY'] > -3):
         game_state['ballSpeedY'] -=    1


def player2_is_AI(level):
   if (game_state['ballX'] > game_state['boundX'] // 2 - level * 25):
      if (game_state['ballY'] > game_state['y2'] + game_state['playerHeight']):
         game_state['y2'] = min(game_state['boundY'] - game_state['playerHeight'], game_state['y2'] + level)
      else:
         game_state['y2'] = max(0, game_state['y2'] - level)

async def game_loop():
	level = random.randint(3, 8)
	while game_state['state'] != 'gameover' and game_state['state'] != 'quit':
		if (game_state['state'] == 'playing'):
			update_positions()
			if (game_state['modality'] == 'solo'):
				player2_is_AI(level)

def reset_game(match):
   game_state['id'] = match.id
   game_state['v'] = match.v
   game_state['key'] = match.key
   game_state['ballWidth'] = match.ballWidth
   game_state['ballHeight'] = match.ballHeight
   game_state['playerWidth'] = match.playerWidth
   game_state['playerHeight'] = match.playerHeight
   game_state['finalScore'] = match.finalScore
   game_state['x1'] = match.x1
   game_state['y1'] = match.y1
   game_state['score1'] = match.score1
   game_state['name1'] = match.name1
   game_state['x2'] = match.x2
   game_state['y2'] = match.y2
   game_state['score2'] = match.score2
   game_state['name2'] = match.name2
   game_state['ballX'] = match.ballX
   game_state['ballY'] = match.ballY
   game_state['ballSpeedX'] = match.ballSpeedX
   game_state['ballSpeedY'] = match.ballSpeedY
   game_state['boundX'] = match.boundX
   game_state['boundY'] = match.boundY
   game_state['state'] = match.state
   game_state['modality'] = match.modality  
   game_loop()

def update_state(state):
   game_state['state'] = state

def get_game_state():
   return (game_state) 
