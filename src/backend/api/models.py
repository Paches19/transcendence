from django.db import models
from django.contrib.auth.models import AbstractUser
import datetime

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
        'Tournament', on_delete=models.CASCADE, null=True, blank=True, default=None)


# User inherits from AbstractUser, which is a built-in Django model
# this allows us to use the built-in Django authentication system
class User(AbstractUser):
    profilePicture = models.CharField(default='/avatars/default.jpg')
    status = models.BooleanField(default=True)  # online or offline
    totalPoints = models.IntegerField(default=0)
    matchesTotal = models.IntegerField(default=0)
    matchesWon = models.IntegerField(default=0)
    matchesLost = models.IntegerField(default=0)


class Friend(models.Model):
    friendID = models.AutoField(primary_key=True)
    user1 = models.ForeignKey(
        'User', related_name='user1', on_delete=models.CASCADE)
    user2 = models.ForeignKey(
        'User', related_name='user2', on_delete=models.CASCADE)
    # False for pending, True for accepted
    status = models.BooleanField(default=False)


class Tournament(models.Model):
    TOURNAMENT_STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('in_progress', 'In Progress'),
        ('ended', 'Ended'),
    ]
    tournamentID = models.AutoField(primary_key=True, unique=True)
    name = models.CharField(max_length=50)
    date = models.DateField(default=datetime.date.today)
    number_participants = models.IntegerField()
    status = models.CharField(
        max_length=11, choices=TOURNAMENT_STATUS_CHOICES, default='Upcoming')


class UserTournament(models.Model):
    userTournamentID = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        'User', related_name='user', on_delete=models.CASCADE)
    tournament = models.ForeignKey(
        'Tournament', related_name='tournament', on_delete=models.CASCADE)
