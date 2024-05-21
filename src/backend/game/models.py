from django.db import models

class MatchRemote(models.Model):
     id = models.AutoField(primary_key=True)
     def __str__(self) -> str:
           return f"{self.id}"
     
class GameStatus(models.Model):
     id = models.AutoField(primary_key=True)
     x1 = models.IntegerField()
     y1 = models.IntegerField()
     score1 = models.IntegerField()
     name1 = models.CharField(max_length=100)
     x2 = models.IntegerField()
     y2 = models.IntegerField()
     score2 = models.IntegerField()
     name2 = models.CharField(max_length=100)
     ballX = models.IntegerField()
     ballY = models.IntegerField()
     ballSpeedX = models.IntegerField()
     ballSpeedY = models.IntegerField()
     state = models.CharField(max_length=100)
     def __str__(self) -> str:
         return f"{self.id}"
