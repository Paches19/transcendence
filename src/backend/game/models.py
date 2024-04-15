#******************************************************************************#
#                                                                              #
#                                                         :::      ::::::::    #
#    models.py                                          :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: alaparic <alaparic@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/04/15 12:03:07 by alaparic          #+#    #+#              #
#    Updated: 2024/04/15 13:30:03 by alaparic         ###   ########.fr        #
#                                                                              #
#******************************************************************************#

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
