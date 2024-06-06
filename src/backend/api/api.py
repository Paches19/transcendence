#******************************************************************************#
#                                                                              #
#                                                         :::      ::::::::    #
#    api.py                                             :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: alaparic <alaparic@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/05/27 12:37:59 by alaparic          #+#    #+#              #
#    Updated: 2024/06/06 09:19:31 by alaparic         ###   ########.fr        #
#                                                                              #
#******************************************************************************#

import os
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout
from ninja import NinjaAPI, File
from ninja.files import UploadedFile
from ninja.params import Query
from .models import User, Friend, Tournament, UserTournament, Match
from .middleware import login_required, require_auth
from .populate_data import *
from typing import Optional
from .schema import (ErrorSchema, UserUpdateSchema,
                     UserRegisterSchema, LoginSchema, SingleTournamentSchema,
                     AddFriendSchema, TournamentSchema, UserNameSchema,
                     UserSchema, SuccessSchema, TournamentCreateSchema)

MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10MB

app = NinjaAPI(
    title="ft_transcendence API",
    version="1.0",
    description="API for the ft_transcendence project made with the django-ninja library.",
)

""" Auth """


@app.post("auth/register", response={200: SuccessSchema, 400: ErrorSchema}, tags=['Auth'])
def create_user(request, user_in: UserRegisterSchema):
    if User.objects.filter(username=user_in.username).exists():
        return 400, {"error_msg": "User already exists"}

    if (len(user_in.username.strip()) < 3 or len(user_in.username.strip()) > 20):
        return 400, {"error_msg": "Invalid username length"}

    user_in.username = user_in.username.strip()

    if (len(user_in.password) <= 0 or len(user_in.password) > 128):
        return 400, {"error_msg": "Invalid password"}

    user_data = user_in.model_dump()
    User.objects.create_user(**user_data)
    return {"msg": "User created"}


@app.post("auth/login", tags=['Auth'])
def login_user(request, login_in: LoginSchema):
    user = authenticate(request, username=login_in.username,
                        password=login_in.password)
    if user is not None:
        login(request, user)
        user.online = True
        user.save()
        return {"msg": "Login successful"}
    else:
        return {"error_msg": "Login failed"}


@app.get("auth/logout", tags=['Auth'])
@login_required
def logout_user(request):
    user = request.user
    user.online = False
    user.save()
    logout(request)
    return {"msg": "Logout successful"}


""" Users """


@app.get("users", response=UserSchema, tags=['Users'])
def get_users(request, user_id: Optional[int] = None):
    if user_id:
        user = get_object_or_404(User, id=user_id)
        if user is None:
            return 400, {"error_msg": "User not found"}
    else:
        auth_response = require_auth(request)
        if auth_response is not None:
            return auth_response
        user = request.user

    resp = {
        "id": user.id,
        "username": user.username,
        "profilePicture": str(user.profilePicture),
        "totalPoints": user.totalPoints,
        "online": user.online,
        "matchesTotal": user.matchesTotal,
        "matchesWon": user.matchesWon,
        "matchesLost": user.matchesLost,
        "tournamentsPlayed": userTournamentsPlayed(user),
        "tournamentsWon": userTournamentsWon(user),
        "friends": populate_friends(user),
        "matches": populate_matches(user)
    }
    return resp


@app.post("users/update", response={200: UserNameSchema, 400: ErrorSchema}, tags=['Users'])
@login_required
def update_user(request, user_in: UserUpdateSchema):
    user = request.user
    user_data = user_in.dict()

    if (user_data["username"] != user.username):
        if User.objects.filter(username=user_data["username"]).exists():
            return 400, {"error_msg": "Username already exists"}
        if (len(user_data["username"].strip()) < 3 or len(user_data["username"].strip()) > 20):
            return 400, {"error_msg": "Invalid username length"}
        user.username = user_data["username"].strip()

    if user_in.password is not None:
        if len(user_in.password) >= 0 and len(user_in.password) < 128:
            user.set_password(user_in.password)
        else:
            return 400, {"error_msg": "Invalid password"}
    user.save()
    # Reauthenticate user
    login(request, user)
    return {"username": user.username}


@app.post("users/avatar", response={200: SuccessSchema, 400: ErrorSchema}, tags=['Users'])
@login_required
def update_avatar(request, file: UploadedFile = File(...)):
    avatar_data = file.read()
    user_id = request.user.id

    # Check image size
    if len(avatar_data) > MAX_IMAGE_SIZE:
        return 400, {"error_msg": "Image size too large"}
    if len(avatar_data) == 0:
        return 400, {"error_msg": "Empty image"}

    # Check image format
    if file.content_type not in ["image/jpeg", "image/png", "image/gif"]:
        return 400, {"error_msg": "Image format not supported"}

    # Delete previous avatar unless default
    if request.user.profilePicture != "/api/static/avatars/default.jpg":
        os.remove(request.user.profilePicture)

    # Save the uploaded image
    relative_file_route = os.path.join("api", "static", "avatars",
                                       str(user_id) + "." + file.content_type.split('/')[-1])
    file_route = os.path.join(os.getcwd(), relative_file_route)
    file = open(file_route, "wb")
    file.write(avatar_data)
    file.close()

    # Update the user avatar route
    user = get_object_or_404(User, id=user_id)
    user.profilePicture = "/"+relative_file_route
    user.save()
    return {"msg": "Avatar updated"}


@app.post("users/friends/add", response={200: SuccessSchema, 400: ErrorSchema}, tags=['Users'])
@login_required
def add_friend(request, friend_username: AddFriendSchema):
    # if friend does not exist
    if not User.objects.filter(username=friend_username.friend_username).exists():
        return 400, {"error_msg": "User does not exist"}

    user = request.user
    friend = get_object_or_404(User, username=friend_username.friend_username)

    if user == friend:
        return 400, {"error_msg": "Cannot add yourself as friend"}

    if Friend.objects.filter(user1=user, user2=friend).exists() or Friend.objects.filter(user1=friend, user2=user).exists():
        return 400, {"error_msg": "Friend request already sent"}

    friend_data = {
        "user1": user,
        "user2": friend
    }

    Friend.objects.create(**friend_data)
    return 200, {"msg": "Friend request sent"}


@app.post("users/friends/accept", response={200: SuccessSchema, 400: ErrorSchema}, tags=['Users'])
@login_required
def accept_friend(request, friend_username: AddFriendSchema):
    user = request.user
    friend = get_object_or_404(User, username=friend_username.friend_username)

    # can't accept a friend request if user is the sender
    friend_request = Friend.objects.filter(user1=user, user2=friend).first()
    if friend_request is not None and user == friend_request.user1:
        return 400, {"error_msg": "Can't accept your own friend request"}

    if not Friend.objects.filter(user1=friend, user2=user, status=False).exists():
        return 400, {"error_msg": "Friend request not found"}

    friendship = get_object_or_404(Friend, user1=friend, user2=user)
    friendship.status = True
    friendship.save()
    return 200, {"msg": "Friend request accepted"}


@app.post("users/friends/remove", response={200: SuccessSchema, 400: ErrorSchema}, tags=['Users'])
@login_required
def remove_friend(request, friend_username: AddFriendSchema):
    user = request.user
    friend = get_object_or_404(User, username=friend_username.friend_username)

    if not Friend.objects.filter(user1=user, user2=friend).exists() and not Friend.objects.filter(user1=friend, user2=user).exists():
        return 400, {"error_msg": "Friend not found"}

    if Friend.objects.filter(user1=user, user2=friend).exists():
        friendship = get_object_or_404(Friend, user1=user, user2=friend)
    else:
        friendship = get_object_or_404(Friend, user1=friend, user2=user)
    friendship.delete()
    return 200, {"msg": "Friend removed"}


""" Tournaments """


@app.post("tournaments/create", response={200: SuccessSchema, 400: ErrorSchema}, tags=['Tournaments'])
def create_tournament(request, tournament_in: TournamentCreateSchema):
    tournament_data = tournament_in.dict()
    if (tournament_data["number_participants"] < 2 or
            tournament_data["number_participants"] > 20):
        return 400, {"error_msg": "Invalid number of participants"}
    if (tournament_data["name"].strip() == "" or len(tournament_data["name"].strip()) < 3):
        return 400, {"error_msg": "Invalid name"}
    if (len(tournament_data["name"]) < 3 or len(tournament_data["name"]) > 30):
        return 400, {"error_msg": "Invalid name length"}
    Tournament.objects.create(**tournament_data)
    return {"msg": "Tournament created"}


@app.get("tournaments", response=list[TournamentSchema], tags=['Tournaments'])
def get_tournaments(request):
    all_tournaments = Tournament.objects.all()
    resp = []
    for tournament in all_tournaments:
        resp.append({
            "id": tournament.tournamentID,
            "name": tournament.name,
            "date": tournament.date.isoformat(),
            "status": tournament.status,
            "current_participants": UserTournament.objects.filter(tournament=tournament).count(),
            "number_participants": tournament.number_participants,
            "participants": populate_tournament_participants(tournament)
        })
    return resp


@app.get("tournaments/{tournament_id}", response=SingleTournamentSchema, tags=['Tournaments'])
def get_tournament(request, tournament_id: int):
    tournament = get_object_or_404(Tournament, tournamentID=tournament_id)
    resp = {
        "id": tournament.tournamentID,
        "name": tournament.name,
        "date": tournament.date.isoformat(),
        "status": tournament.status,
        "current_participants": UserTournament.objects.filter(tournament=tournament).count(),
        "number_participants": tournament.number_participants,
        "participants": populate_tournament_participants(tournament),
        "standings": populate_standings(tournament),
        "matches": populate_tournament_matches(tournament_id)
    }
    return resp


@app.post("tournaments/{tournament_id}/join", response={200: SuccessSchema, 400: ErrorSchema}, tags=['Tournaments'])
@login_required
def join_tournament(request, tournament_id: int):
    user = get_object_or_404(User, id=request.user.id)
    tournament = get_object_or_404(Tournament, tournamentID=tournament_id)

    if UserTournament.objects.filter(user=user, tournament=tournament).exists():
        return 400, {"error_msg": "User already in tournament"}

    if tournament.status != "Upcoming":
        return 400, {"error_msg": "Tournament is " + tournament.status}

    user_tournament_data = {
        "user": user,
        "tournament": tournament
    }

    UserTournament.objects.create(**user_tournament_data)

    if UserTournament.objects.filter(tournament=tournament).count() >= tournament.number_participants:
        tournament.status = "In Progress"
        tournament.save()
        doTournamentMatchmaking(tournament)

    return 200, {"msg": "User joined tournament"}


@app.post("tournaments/{tournament_id}/leave", response={200: SuccessSchema, 400: ErrorSchema}, tags=['Tournaments'])
@login_required
def leave_tournament(request, tournament_id: int):
    user = get_object_or_404(User, id=request.user.id)
    tournament = get_object_or_404(Tournament, tournamentID=tournament_id)

    if not UserTournament.objects.filter(user=user, tournament=tournament).exists():
        return 400, {"error_msg": "User not in tournament"}

    if tournament.status == "Ended":
        return 400, {"error_msg": "Tournament has ended"}

    # If tournament is in progress, user looses unplayed matches
    if tournament.status == "In Progress":
        matches = Match.objects.filter(
            tournament=tournament, user1=user) | Match.objects.filter(tournament=tournament, user2=user)
        for match in matches:
            if match.pointsUser1 == 0 and match.pointsUser2 == 0:
                if match.user1 == user:
                    match.winner = match.user2
                else:
                    match.winner = match.user1
                match.pointsUser1 = 0
                match.pointsUser2 = 0
                match.save()

    user_tournament = get_object_or_404(
        UserTournament, user=user, tournament=tournament)
    user_tournament.delete()

    checkTournamentFinished(tournament)
    return 200, {"msg": "User left tournament"}
