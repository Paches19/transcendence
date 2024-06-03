import random

level = random.randint(5, 10)

def move_paddles(key, match):
	if key == 'up1':
		match.y1 = max(0, match.y1 - match.v)
	elif key == 'down1':
		match.y1 = min(match.boundY - match.playerHeight, match.y1 + match.v)
	elif key == 'up2':
		match.y2 = max(0, match.y2 - match.v)
	elif key == 'down2':
		match.y2 = min(match.boundY - match.playerHeight, match.y2 + match.v)
    
	return match  
     

def moveball(match):
    # Update ball position
   if match.ballY + match.ballSpeedY <= 0 or match.ballY + match.ballSpeedY >= match.boundY:
       match.ballSpeedY = -match.ballSpeedY
   match.ballSpeedX += match.ballSpeedX
   match.ballSpeedY += match.ballSpeedY

  	# Check for collisions with walls
    # Left wall (Paddle 1)
   if (match.ballX <= match.x1):
      match.score2 += 1
      if (match.score2 == match.finalScore):
         match.state = 'gameover'
      else:
          match.ballX = match.boundX // 2 - match.ballWidth // 2
          match.ballY = match.boundY // 2 - match.ballHeight // 2

	# Right wall (Paddle 2)
   elif (match.ballX >= match.x2 + match.playerWidth):
      match.score1 += 1
      if (match.score1 == match.finalScore):
          match.state = 'gameover'
      else:
          match.ballX = match.boundX // 2 - match.ballWidth // 2
          match.ballY = match.boundY // 2 - match.ballHeight // 2

   # Paddle collisions
   elif ((match.ballY <= match.ballHeight + match.y2 and match.ballY >= match.y2 and match.ballX + match.ballWidth >= match.x2) or
	  (match.ballY <= match.ballHeight + match.y1 and match.ballY >= match.y1 and match.ballX - match.ballWidth <= match.x1)):
      match.ballSpeedX = -match.ballSpeedX
      if (match.ballX > match.x1 and match.ballX < match.x1 + match.playerWidth):
         match.ballX = match.x1 + match.playerWidth + 1

      if (match.ballX > match.x2 and match.ballX < match.x2 + match.playerWidth):
         match.ballX = match.x2 - match.ballWidth - 1

      if ((match.ballY > match.y1 + match.playerHeight * 0.75 or match.ballY > match.y2 + match.playerHeight * 0.75) and match.ballSpeedY < 3):
         match.ballSpeedY += 1

      if ((match.ballY < match.y1+ match.playerHeight * 0.25 or match.ballY < match.y2 + match.playerHeight * 0.25) and match.ballSpeedY > -3):
         match.ballSpeedY -=    1

      return match


def play_ai(match):
	if (match.ballX > match.boundX // 2 - level * 25):
		if (match.ballY > match.y2 + match.playerHeight):
			match.y2 = min(match.boundY - match.playerHeight, match.y2 + level)
		else:
			match.y2 = max(0, match.y2 - level)
	return match


def get_state(match):
	newmatch = moveball(match)
	if match.modality == 'solo':
		match = play_ai(newmatch)
	return match
