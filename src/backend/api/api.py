import os
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout
from ninja import NinjaAPI, File
from ninja.files import UploadedFile
from ninja.params import Query
from .models import User, Friend, Tournament, UserTournament, GameStatus
from .middleware import login_required, require_auth
from .populate_data import *
from typing import Optional
from .schema import (ErrorSchema, UserUpdateSchema,
                     UserRegisterSchema, LoginSchema, SingleTournamentSchema,
                     AddFriendSchema, TournamentSchema, UserNameSchema,
                     UserSchema, SuccessSchema, TournamentCreateSchema,
                     GameStatusSchema, SuccessGameStatusSchema)

MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10MB

app = NinjaAPI(
    title="ft_transcendence API",
    version="1.0",
    description="API for the ft_transcendence project made with the django-ninja library.",
)

""" Game """
@app.post('play_ai', response={200: SuccessGameStatusSchema, 400: ErrorSchema}, tags=['Game'])
def play_ai(request, match:GameStatusSchema):
	try:
		if match.ballX > match.boundX // 2 -  5 * 25:
			if match.ballY > match.y2 + match.playerHeight:
				match.y2 = min(match.boundY - match.playerHeight, match.y2 + 5)
			else:
				match.y2 = max(0, match.y2 - 5)
		return 200, {"msg": "AI played", "match": match}
	except Exception as e:
		return 400, {"error_msg": "Error playing AI : " + str(e)}


@app.post('move_paddles', response={200: SuccessGameStatusSchema, 400: ErrorSchema}, tags=['Game'])
def move_paddles(request, match:GameStatusSchema):
	try:
		if match.key == 'ArrowUp':
			match.y1 = max(0, match.y1 - match.v)
			msg = "Paddle1 moved up"
		elif match.key == 'ArrowDown':
			match.y1 = min(match.boundY - match.playerHeight, match.y1 + match.v)
			msg = "Paddle1 moved down"
		elif match.key == 'w' or match.key == 'W':
			match.y2 = max(0, match.y2 - match.v)
			msg = "Paddle2 moved up"
		elif match.key == 's' or match.key == 'S':
			match.y2 = min(match.boundY - match.playerHeight, match.y2 + match.v)
			msg = "Paddle2 moved down"
		return 200, {"msg": msg, "match": match}
	except Exception as e:
		return 400, {"error_msg": "Error moving paddle : {str(e)}"}


@app.post('move_ball', response={200: SuccessGameStatusSchema, 400: ErrorSchema}, tags=['Game'])
def move_ball(request, match:GameStatusSchema):
	try:
		# Update ball position
		if match.ballY + match.ballSpeedY <= 0 or match.ballY + match.ballSpeedY >= match.boundY:
			match.ballSpeedY = -match.ballSpeedY
			match.ballSpeedX += match.ballSpeedX
			match.ballSpeedY += match.ballSpeedY

		# Check for collisions with walls
		# Left wall (Paddle 1)
		if match.ballX <= match.x1:
			match.score2 += 1
			if match.score2 == match.finalScore:
				match.state = 'gameover'
			else:
				match.ballX = match.boundX // 2 - match.ballWidth // 2
				match.ballY = match.boundY // 2 - match.ballHeight // 2

		# Right wall (Paddle 2)
		elif match.ballX >= match.x2 + match.playerWidth:
			match.score1 += 1
			if match.score1 == match.finalScore:
				match.state = 'gameover'
			else:
				match.ballX = match.boundX // 2 - match.ballWidth // 2
				match.ballY = match.boundY // 2 - match.ballHeight // 2

		# Paddle collisions
		elif (match.ballY <= match.ballHeight + match.y2 and match.ballY >= match.y2 and match.ballX + match.ballWidth >= match.x2) or \
				(match.ballY <= match.ballHeight + match.y1 and match.ballY >= match.y1 and match.ballX - match.ballWidth <= match.x1):
			match.ballSpeedX = -match.ballSpeedX
		if match.ballX > match.x1 and match.ballX < match.x1 + match.playerWidth:
			match.ballX = match.x1 + match.playerWidth + 1

		if match.ballX > match.x2 and match.ballX < match.x2 + match.playerWidth:
			match.ballX = match.x2 - match.ballWidth - 1

		if (match.ballY > match.y1 + match.playerHeight * 0.75 or match.ballY > match.y2 + match.playerHeight * 0.75) and match.ballSpeedY < 3:
			match.ballSpeedY += 1

		if (match.ballY < match.y1 + match.playerHeight * 0.25 or match.ballY < match.y2 + match.playerHeight * 0.25) and match.ballSpeedY > -3:
			match.ballSpeedY -= 1
		return 200, {"msg": "Ball moved", "match": match}
	except Exception as e:
		return 400, {"error_msg": "Error moving ball : " + str(e)}


@app.post("new_match", response={200: SuccessSchema, 400: ErrorSchema}, tags=['Match'])
def new_match(request, match: GameStatusSchema):
    try:
        print("Comprobando si existe Match ID: ", match.id)
        GameStatus.objects.get(id=match.id)
        return 400, {"error_msg": "Match already exists"}
    except GameStatus.DoesNotExist:
        GameStatus.objects.create(id=match.id)
        return {"msg": "Match created"}


@app.post("join_match", response=SuccessSchema, tags=['Match'])
def join_match(request, match: GameStatusSchema):
    try:
        GameStatus.objects.get(id=match.id)
        return {"msg": "Match joined"}
    except GameStatus.DoesNotExist:
        return 400, {"error_msg": "Match does not exist"}


@app.post("delete_match", response={200: SuccessSchema, 400: ErrorSchema}, tags=['Match'])
def delete_match(request, match: GameStatusSchema):
    try:
        tmpmatch = GameStatus.objects.get(id=match.id)
        tmpmatch.delete()
        return 200, {"msg": "Match deleted"}
    except GameStatus.DoesNotExist:
        return 400, {"error_msg": "Match does not exist"}


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
        "status": user.status,
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

    if (user_data["username"] is not None and
            user_data["username"] != user.username):
        if User.objects.filter(username=user_data["username"]).exists():
            return 400, {"error_msg": "Username already exists"}
        user.username = user_data["username"]

    if user_in.password is not None:
        user.set_password(user_in.password)
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
    if request.user.profilePicture != "/static/avatars/default.jpg":
        os.remove("api"+request.user.profilePicture)

    # Save the uploaded image
    relative_file_route = os.path.join("static", "avatars",
                                       str(user_id) + "." + file.content_type.split('/')[-1])
    file_route = os.path.join(os.getcwd(), "api", relative_file_route)
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
    if (user == Friend.objects.filter(user1=user, user2=friend).first().user1):
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

    if UserTournament.objects.filter(tournament=tournament).count() >= tournament.number_participants:
        tournament.status = "In Progress"
        tournament.save()

    user_tournament_data = {
        "user": user,
        "tournament": tournament
    }

    UserTournament.objects.create(**user_tournament_data)
    return 200, {"msg": "User joined tournament"}


@app.post("tournaments/{tournament_id}/leave", response={200: SuccessSchema, 400: ErrorSchema}, tags=['Tournaments'])
@login_required
def leave_tournament(request, tournament_id: int):
    user = get_object_or_404(User, id=request.user.id)
    tournament = get_object_or_404(Tournament, tournamentID=tournament_id)

    if not UserTournament.objects.filter(user=user, tournament=tournament).exists():
        return 400, {"error_msg": "User not in tournament"}

    user_tournament = get_object_or_404(
        UserTournament, user=user, tournament=tournament)
    user_tournament.delete()
    return 200, {"msg": "User left tournament"}
