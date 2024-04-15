# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    models.py                                          :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: jutrera- <jutrera-@student.42madrid.com    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/04/15 12:03:07 by alaparic          #+#    #+#              #
#    Updated: 2024/04/15 19:45:22 by jutrera-         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from django.db import models

# Create your models here.


class Match(models.Model):
    matchID = models.AutoField(primary_key=True)
    user1 = models.ForeignKey(
        'User', related_name='user1_match', on_delete=models.CASCADE)
    user2 = models.ForeignKey(
        'User', related_name='user2_match', on_delete=models.CASCADE)
    pointsUser1 = models.IntegerField(default=0)
    pointsUser2 = models.IntegerField(default=0)
    date = models.DateField()
    tournamentId = models.ForeignKey(
        'Tournament', on_delete=models.CASCADE, null=True, blank=True)


class User(models.Model):
    userID = models.AutoField(primary_key=True)
    profilePicture = models.ImageField(
        upload_to='profile_pictures/', null=True)
    name = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
    totalPoints = models.IntegerField(default=0)
    status = models.BooleanField(default=True)
    matchesTotal = models.IntegerField(default=0)
    matchesWon = models.IntegerField(default=0)
    matchesLost = models.IntegerField(default=0)
    matchesDraw = models.IntegerField(default=0)


class Friend(models.Model):
    friendID = models.AutoField(primary_key=True)
    user1 = models.ForeignKey(
        'User', related_name='user1', on_delete=models.CASCADE)
    user2 = models.ForeignKey(
        'User', related_name='user2', on_delete=models.CASCADE)
    status = models.BooleanField(default=False)


class Tournament(models.Model):
    tournamentID = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    startDate = models.DateField()
    endDate = models.DateField()


class UserTournament(models.Model):
    userTournamentID = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        'User', related_name='user', on_delete=models.CASCADE)
    tournament = models.ForeignKey(
        'Tournament', related_name='tournament', on_delete=models.CASCADE)

#########################  jutrera- ######################################

class Player(models.Model):
    name = models.CharField(max_length=100)
    x = models.IntegerField(default=0)
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