from django.db import models

class GameStatus:
     def __init__(self, v, key, ballWidth, ballHeight, playerWidth, playerHeight, finalScore, x1, y1, score1, name1,
                  x2, y2, score2, name2, ballX, ballY, ballSpeedX, ballSpeedY, boundX, boundY, state, modality) -> None:
          self.id = models.AutoField(primary_key=True)
          self.v =  v
          self.key = key
          self.ballWidth = ballWidth
          self.ballHeight = ballHeight
          self.playerWidth = playerWidth
          self.playerHeight = playerHeight
          self.finalScore = finalScore
          self.x1 = x1
          self.y1 = y1
          self.score1 = score1
          self.name1 = name1
          self.x2 = x2
          self.y2 = y2
          self.score2 = score2
          self.name2 = name2
          self.ballX = ballX
          self.ballY = ballY
          self.ballSpeedX = ballSpeedX
          self.ballSpeedY = ballSpeedY
          self.boundX = boundX
          self.boundY = boundY
          self.state = state
          self.modality = modality

     def __str__(self) -> str:
           return f"{self.id}"

     def getBallInfo(self):
          return {
               "ballX": self.ballX,
               "ballY": self.ballY,
               "ballSpeedX": self.ballSpeedX,
               "ballSpeedY": self.ballSpeedY
          }

