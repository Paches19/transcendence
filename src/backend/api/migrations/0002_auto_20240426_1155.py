# Generated by Django 5.0.4 on 2024-04-26 11:55

from django.db import migrations
import datetime
import random


def generate_users_data(apps, schema_editor):
    User = apps.get_model("api", "User")
    for i in range(10):
        User.objects.create_user(username=f"user{i+1}", password=f"pass123")


def generate_tournaments_data(apps, schema_editor):
    Tournament = apps.get_model("api", "Tournament")
    for i in range(10):
        Tournament.objects.create(name=f"tournament{i+1}",
                                  startDate=datetime.date.today().isoformat(),
                                  endDate=datetime.date.today().isoformat(),
                                  number_participants=random.randint(2, 16))


def generate_matches_data(apps, schema_editor):
    Match = apps.get_model("api", "Match")
    User = apps.get_model("api", "User")
    Tournament = apps.get_model("api", "Tournament")
    for i in range(9):
        user1 = User.objects.get(username=f"user{i+1}")
        user2 = User.objects.get(username=f"user{i+2}")
        tournament = Tournament.objects.get(name=f"tournament{i+1}")
        Match.objects.create(user1=user1, user2=user2, tournamentId=tournament,
                             pointsUser1=random.randint(0, 100),
                             pointsUser2=random.randint(0, 100),
                             date=datetime.date.today().isoformat())


def generate_friends_data(apps, schema_editor):
    Friend = apps.get_model("api", "Friend")
    User = apps.get_model("api", "User")
    for i in range(8):
        user1 = User.objects.get(username=f"user{i+1}")
        user2 = User.objects.get(username=f"user{i+2}")
        Friend.objects.create(user1=user1, user2=user2, status=True)

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(generate_users_data),
        migrations.RunPython(generate_tournaments_data),
        migrations.RunPython(generate_matches_data),
        migrations.RunPython(generate_friends_data),
    ]
