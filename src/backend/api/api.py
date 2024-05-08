import os
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout
from ninja import NinjaAPI, File
from ninja.files import UploadedFile
from ninja.params import Query
from .models import User, Friend, Tournament, UserTournament, Match
from .middleware import login_required, require_auth
from typing import Optional
from .schema import (UserSchema, ErrorSchema, UserUpdateSchema,
                     UserRegisterSchema, LoginSchema,
                     AddFriendSchema, TournamentSchema, BasicUserSchema,
                     UserNameSchema, MatchSchema, UserFriendSchema, FriendSchema,
                     SuccessSchema, TournamentCreateSchema)

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

    user_data = user_in.model_dump()
    User.objects.create_user(**user_data)
    return {"msg": "User created"}


@app.post("auth/login", tags=['Auth'])
def login_user(request, login_in: LoginSchema):
    user = authenticate(request, username=login_in.username,
                        password=login_in.password)
    if user is not None:
        login(request, user)
        return {"msg": "Login successful"}
    else:
        return {"error_msg": "Login failed"}


@app.get("auth/logout", tags=['Auth'])
def logout_user(request):
    logout(request)
    return {"msg": "Logout successful"}


""" Users """


# aux function to add friend data to the get_users response
def populate_friends(user):
    all_friends = Friend.objects.all()
    friends = []
    for friend in all_friends:
        if friend.user1 == user.id:
            friends.append({
                "id": friend.user2.id,
                "name": friend.user2.username,
                "profilePicture": friend.user2.profilePicture,
                "status": friend.status
            })
        elif friend.user2 == user.id:
            friends.append({
                "id": friend.user1.id,
                "name": friend.user1.username,
                "profilePicture": friend.user1.profilePicture,
                "status": friend.status
            })
    return friends


@app.get("users", response=UserFriendSchema, tags=['Users'])
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
        "status": user.status,
        "matchesTotal": user.matchesTotal,
        "matchesWon": user.matchesWon,
        "matchesLost": user.matchesLost,
        "matchesDraw": user.matchesDraw,
        "friends": populate_friends(user)
    }
    return resp


@app.post("users/update", response={200: UserNameSchema, 400: ErrorSchema}, tags=['Users'])
@login_required
def update_user(request, user_in: UserUpdateSchema):
    user = request.user
    user_data = user_in.dict()

    if user_data["username"] is not None:
        if User.objects.filter(username=user_data["username"]).exists():
            return 400, {"error_msg": "Username already exists"}
        user.username = user_data["username"]

    if user_in.password is not None:
        user.set_password(user_in.password)
    user.save()
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

    # Save the uploaded image
    file_route = os.path.join(os.getcwd(), "users", "static", "avatars", (str(
        user_id) + "." + str(file.content_type[-4:])))
    file = open(file_route, "wb")
    file.write(avatar_data)
    file.close()

    # Update the user avatar route
    user = get_object_or_404(User, id=user_id)
    user.profilePicture = file_route
    return {"msg": "Avatar updated"}


@app.post("users/friends/add", response={200: UserSchema, 400: ErrorSchema}, tags=['Users'])
@login_required
def add_friend(request, friend_in: AddFriendSchema):
    user_id = request.user.id
    user = get_object_or_404(User, id=user_id)
    friend = get_object_or_404(User, id=friend_in.friend_id)

    friend_data = {
        "user1": user,
        "user2": friend
    }

    Friend.objects.create(**friend_data)
    return 200, {"error_msg": "Friend request sent"}


@app.post("users/friends/accept", response={200: UserSchema, 400: ErrorSchema}, tags=['Users'])
@login_required
def accept_friend(request, friend_in: AddFriendSchema):
    user = request.user
    friend = get_object_or_404(User, id=friend_in.friend_id)

    if not Friend.objects.filter(user1=user, user2=friend, status=False).exists():
        return 400, {"error_msg": "Friend request not found"}

    friendship = get_object_or_404(Friend, user1=user, user2=friend)
    friendship.status = True
    friendship.save()
    return 200, {"error_msg": "Friend request accepted"}


@app.post("users/friends/remove", response={200: UserSchema, 400: ErrorSchema}, tags=['Users'])
@login_required
def remove_friend(request, friend_in: AddFriendSchema):
    user = request.user
    friend = get_object_or_404(User, id=friend_in.friend_id)

    if not Friend.objects.filter(user1=user, user2=friend).exists() and not Friend.objects.filter(user1=friend, user2=user).exists():
        return 400, {"error_msg": "Friend not found"}

    user.friends.remove(friend)
    return user


""" Tournaments """


@app.post("tournaments/create", response={200: SuccessSchema, 400: ErrorSchema}, tags=['Tournaments'])
def create_tournament(request, tournament_in: TournamentCreateSchema):
    tournament_data = tournament_in.dict()
    Tournament.objects.create(**tournament_data)
    return {"msg": "Tournament created"}


@app.get("tournaments", response=list[TournamentSchema], tags=['Tournaments'])
def get_tournaments(request):
    all_tournaments = Tournament.objects.all()
    resp = []
    for tournament in all_tournaments:
        resp.append({
            "name": tournament.name,
            "date": tournament.date.isoformat(),
            "status": tournament.status,
            "number_participants": tournament.number_participants,
            "participants": [{"user_id": user.id, "username": user.username} for user in UserTournament.objects.filter(tournament=tournament)]
        })
    return resp


@app.get("tournaments/{tournament_id}", response=TournamentSchema, tags=['Tournaments'])
def get_tournament(request, tournament_id: int):
    tournament = get_object_or_404(Tournament, tournamentID=tournament_id)
    return tournament


@app.post("tournaments/{tournament_id}/join", response={200: SuccessSchema, 400: ErrorSchema}, tags=['Tournaments'])
def join_tournament(request, user_id: int, tournament_id: int):
    user = get_object_or_404(User, id=user_id)
    tournament = get_object_or_404(Tournament, tournamentID=tournament_id)

    user_tournament_data = {
        "user": user,
        "tournament": tournament
    }

    UserTournament.objects.create(**user_tournament_data)
    return 200, {"msg": "User joined tournament"}


@app.post("tournaments/{tournament_id}/leave", response={200: UserSchema, 400: ErrorSchema}, tags=['Tournaments'])
def leave_tournament(request, user_id: int, tournament_id: int):
    user = get_object_or_404(User, id=user_id)
    tournament = get_object_or_404(Tournament, tournamentID=tournament_id)

    if not UserTournament.objects.filter(user=user, tournament=tournament).exists():
        return 400, {"error_msg": "User not in tournament"}

    user_tournament = get_object_or_404(
        UserTournament, user=user, tournament=tournament)
    user_tournament.delete()
    return 200, {"error_msg": "User left tournament"}


@app.get("tournaments/{tournament_id}/users", response=list[UserNameSchema], tags=['Tournaments'])
def get_tournament_users(request, tournament_id: int):
    tournament = get_object_or_404(Tournament, tournamentID=tournament_id)
    users = UserTournament.objects.filter(tournament=tournament)
    return [user.user.username for user in users]


@app.get("tournaments/{tournament_id}/matches", response=list[MatchSchema], tags=['Tournaments'])
def get_tournament_matches(request, tournament_id: int):
    tournament = get_object_or_404(Tournament, tournamentID=tournament_id)
    matches = Match.objects.filter(tournamentId=tournament)
    return matches


""" Matches """
