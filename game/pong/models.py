# pong/models.py
from django.db import models

class Player(models.Model):
    name = models.CharField(max_length=100)
    x = models.IntegerField()
    y = models.IntegerField(null=True, blank=True)  # Si no se proporciona, se calculará en la vista
    width = models.IntegerField(default=15)
    height = models.IntegerField(default=80)
    color = models.CharField(max_length=50, default='white')
    vx = models.IntegerField(default=4)
    vy = models.IntegerField(default=4)
    score = models.IntegerField(default=0)
    IA = models.BooleanField(default=False)
    won = models.IntegerField(default=0)
    lost = models.IntegerField(default=0)
    def __str__(self):
        return f'Player'

class Ball(models.Model):
	x = models.IntegerField()
	y = models.IntegerField()
	width = models.IntegerField(default=15)
	height = models.IntegerField(default=15)
	color = models.CharField(max_length=50, default='white')
	vx = models.IntegerField(default=4)
	vy = models.IntegerField(default=4)
	def __str__(self):
		return f'Ball'
      
