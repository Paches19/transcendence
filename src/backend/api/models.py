from django.db import models
from django.contrib.auth.models import AbstractUser

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


# User inherits from AbstractUser, which is a built-in Django model
class User(AbstractUser):
    profilePicture = models.ImageField(
        upload_to='profile_pictures/', null=True)
    totalPoints = models.IntegerField(default=0)
    status = models.BooleanField(default=True)  # online or offline
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
    # False for pending, True for accepted
    status = models.BooleanField(default=False)


class Tournament(models.Model):
    TOURNAMENT_STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('in_progress', 'In Progress'),
        ('ended', 'Ended'),
    ]
    tournamentID = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    startDate = models.DateField()
    endDate = models.DateField()
    status = models.CharField(
        max_length=11, choices=TOURNAMENT_STATUS_CHOICES, default='Upcoming')


class UserTournament(models.Model):
    userTournamentID = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        'User', related_name='user', on_delete=models.CASCADE)
    tournament = models.ForeignKey(
        'Tournament', related_name='tournament', on_delete=models.CASCADE)
