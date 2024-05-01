# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    models.py                                          :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: jutrera- <jutrera-@student.42madrid.com    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/04/15 12:03:07 by alaparic          #+#    #+#              #
#    Updated: 2024/05/01 14:33:11 by jutrera-         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from django.db import models

# Create your models here.

class Match(models.Model):
     id = models.AutoField(primary_key=True)
#     user1 = models.ForeignKey(
#         'User', related_name='user1_match', on_delete=models.CASCADE)
#     user2 = models.ForeignKey(
#         'User', related_name='user2_match', on_delete=models.CASCADE)
#     date = models.DateField()
#     tournamentId = models.ForeignKey(
#         'Tournament', on_delete=models.CASCADE, null=True, blank=True)
#     ball = models.ForeignKey('Ball', on_delete=models.CASCADE, null=True)
     def __str__(self) -> str:
#          return f"{self.id} {self.user1} {self.user2} {self.tournamentId} {self.ball}"
           return f"{self.id}"

class User(models.Model):
    id = models.AutoField(primary_key=True)
    profilePicture = models.ImageField(
        upload_to='profile_pictures/', null=True)
    name = models.CharField(max_length=50, default="Unknown")
    password = models.CharField(max_length=50)
    score = models.IntegerField(default=0)
    status = models.BooleanField(default=True)
    matchesTotal = models.IntegerField(default=0)
    matchesWon = models.IntegerField(default=0)
    matchesLost = models.IntegerField(default=0)
    paddle = models.ForeignKey('Paddle', on_delete=models.CASCADE, null=True)
    def __str__(self) -> str:
        return f"{self.id} {self.name} {self.score} {self.status} {self.matchesTotal} {self.matchesWon} {self.matchesLost} {self.paddle}"

class Tournament(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    startDate = models.DateField()
    endDate = models.DateField()
     
class Paddle(models.Model):
    x = models.FloatField(default=0)
    y = models.FloatField(default=0)
    width = models.FloatField(default=10)
    height = models.FloatField(default=10)
    color = models.CharField(max_length=50, default="white")
    def __str__(self) -> str:
	    return f"{self.x} {self.y} {self.width} {self.height} {self.color}"
    
class Ball(models.Model):
    x = models.FloatField(default=0)
    y = models.FloatField(default=0)
    width = models.FloatField(default=10)
    height = models.FloatField(default=10)
    color = models.CharField(max_length=50, default="white")
    vx = models.FloatField(default=1)
    vy = models.FloatField(default=1)
    color = models.CharField(max_length=50, default="white")
    state = models.CharField(max_length=50, default="stopped")
    def __str__(self) -> str:
	    return f"{self.x} {self.y} {self.width} {self.height} {self.color} {self.vx} {self.vy} {self.color} {self.state}"
    
