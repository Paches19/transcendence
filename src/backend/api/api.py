import os
import random
from random import choice
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout
from ninja import NinjaAPI, File
from ninja.files import UploadedFile
from ninja.params import Query
from .models import *
from .middleware import login_required, require_auth
from .populate_data import *
from typing import Optional
from .schema import *
from typing import Dict, Any

MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10MB

game = Game()
paddles = Paddles()
ball = Ball()

app = NinjaAPI(
    title="ft_transcendence API",
    version="1.0",
    description="API for the ft_transcendence project made with the django-ninja library.",
)

""" Game """

@app.get('update_scores', response={200: ScoreSchema, 400: ErrorSchema}, tags=['Game'])
def update_scores(request):
	try:
		if (paddles.score1 == game.finalScore or paddles.score2 == game.finalScore):
			msg = "gameover"
		else:
			msg = "playing"
		return 200, {"msg": msg, "score1": paddles.score1, "score2": paddles.score2}
	except Exception as e:
		return 400, {"error_msg": "Error getting current scores" + str(e)}

@app.post('move_paddles', response={200: MovePaddlesSchema, 400: ErrorSchema}, tags=['Game'])
def move_paddles(request, pressed:KeySchema):
	try:
		if pressed.keypressed == 'ArrowUp':
			paddles.y1 = max(0, paddles.y1 - game.v)
		elif pressed.keypressed == 'ArrowDown':
			paddles.y1 = min(game.boundY - game.playerHeight, paddles.y1 + game.v)
		elif pressed.keypressed == 'w' or pressed.keypressed == 'W' or pressed.keypressed == 'A':
			paddles.y2 = max(0, paddles.y2 - game.v)
		elif pressed.keypressed == 's' or pressed.keypressed == 'S' or pressed.keypressed == 'D':
			paddles.y2 = min(game.boundY - game.playerHeight, paddles.y2 + game.v)
		return 200, {"msg": pressed.keypressed, "paddles": paddles}
	except Exception as e:
		return 400, {"error_msg": "Error moving paddle" + str(e)}


@app.post('init_game', response={200: SuccessInitSchema, 400: ErrorSchema}, tags=['Game'])
def init_game(request, datagame: InitGameSchema):
	try:
		game.id = datagame.id
		game.v = 10
		game.ballWidth = 10
		game.ballHeight = 10
		game.playerWidth = 15
		game.playerHeight = 80
		game.finalScore = 3
		game.name1 = datagame.name1
		game.name2 = datagame.name2
		game.boundX = datagame.boundX
		game.boundY = datagame.boundY
		
		paddles.x1 = 10
		paddles.y1 = datagame.boundY // 2 - game.playerHeight // 2
		paddles.score1 = 0
		paddles.x2 = datagame.boundX - 10 - game.playerWidth
		paddles.y2 = datagame.boundY // 2 - game.playerHeight // 2
		paddles.score2 = 0

		ball.x = datagame.boundX // 2 - game.ballWidth // 2
		ball.y = datagame.boundY // 2 - game.ballHeight // 2
		ball.vx = random.choice([-10, -9, -8, 8, 9, 10])
		ball.vy = random.choice([-3, -2, -1, 1, 2, 3])
		ball.state = 'waiting'

		return 200, {"game": game, "paddles": paddles, "ball": ball}
	except Exception as e:
		return 400, {"error_msg": "Error initializing game" + str(e)}

@app.post('move_ball', response={200: MoveBallSchema, 400: ErrorSchema}, tags=['Game'])
def move_ball(request):
	try:
		# Update ball position
		if ball.y + ball.vy <= 0 or ball.y + ball.vy + game.ballHeight >= game.boundY:
			ball.vy = -ball.vy
		ball.x += ball.vx
		ball.y += ball.vy

		# Check for collisions with walls
		# Left wall (Paddle 1)
		if ball.x < paddles.x1:
			paddles.score2 += 1
			return 200, {"msg": "scored", "ball": ball}

		# Right wall (Paddle 2)
		if ball.x + game.ballWidth >= paddles.x2 + game.playerWidth:
			paddles.score1 += 1
			return 200, {"msg": "scored", "ball": ball}
		# Paddle collisions
		if (ball.y <= game.playerHeight + paddles.y2 and ball.y >= paddles.y2 and ball.x + game.ballWidth >= paddles.x2) or \
			(ball.y <= game.playerHeight + paddles.y1 and ball.y >= paddles.y1 and ball.x <= paddles.x1 + game.playerWidth):
			ball.vx = -ball.vx

			if ball.x < paddles.x1 + game.playerWidth:
				ball.x = paddles.x1 + game.playerWidth + 1 

			if ball.x > paddles.x2:
				ball.x = paddles.x2 - game.ballWidth - 1

			if (ball.y > paddles.y1 + game.playerHeight * 0.75 or ball.y > paddles.y2 + game.playerHeight * 0.75) and ball.vy < 3:
				ball.vy += 1

			if (ball.y < paddles.y1 + game.playerHeight * 0.25 or ball.y < paddles.y2 + game.playerHeight * 0.25) and ball.vy > -3:
				ball.vy -= 1
		return 200, {"msg": "playing", "ball": ball}
	except Exception as e:
		return 400, {"error_msg": "Error moving ball" + str(e)}
   
@app.post('reset_ball', response={200: MoveBallSchema, 400: ErrorSchema}, tags=['Game'])
def reset_ball(request):
	try:
		ball.x = game.boundX // 2 - game.ballWidth // 2
		ball.y = game.boundY // 2 - game.ballHeight // 2
		ball.vx = random.choice([-10, -9, -8, 8, 9, 10])
		ball.vy = random.choice([-3, -2,-1, 1, 2, 3])
		return 200, {"msg": "reset", "ball": ball}

	except Exception as e:
		return 400, {"error_msg": "Error resetting ball" + str(e)}

@app.post("new_match", response={200: SuccessInitSchema, 400: ErrorSchema}, tags=['Match'])
def new_match(request, datagame: InitGameSchema):
	try:
		match = RemoteGame.objects.create(id = datagame.id)
		match.game.id = datagame.id
		match.game.v = 10
		match.game.ballWidth = 10
		match.game.ballHeight = 10
		match.game.playerWidth = 15
		match.game.playerHeight = 80
		match.game.finalScore = 3
		match.game.name1 = datagame.name1
		match.game.name2 = datagame.name2
		match.game.boundX = datagame.boundX
		match.game.boundY = datagame.boundY
		
		match.paddles.x1 = 10
		match.paddles.y1 = datagame.boundY // 2 - match.game.playerHeight // 2
		match.paddles.score1 = 0
		match.paddles.x2 = datagame.boundX - 10 - match.game.playerWidth
		match.paddles.y2 = datagame.boundY // 2 - match.game.playerHeight // 2
		match.paddles.score2 = 0

		match.ball.x = datagame.boundX // 2 - match.game.ballWidth // 2
		match.ball.y = datagame.boundY // 2 - match.game.ballHeight // 2
		match.ball.vx = random.choice([-10, -9, -8, 8, 9, 10])
		match.ball.vy = random.choice([-3, -2, -1, 1, 2, 3])
		match.ball.state = 'waiting'
		match.save()
		return 200, {"game": match.game, "paddles": match.paddles, "ball": match.ball}
	except Exception as e:
		return 400, {"error_msg": "Error initializing game" + str(e)}


@app.post("join_match", response={200: SuccessInitSchema, 400: ErrorSchema}, tags=['Match'])
def join_match(request, datagame: InitGameSchema):
	match = get_object_or_404(RemoteGame, id = datagame.id)
	if match.game.name2 != '':
		return 400, {"error_msg": "Game already has two players"}
	match.game.name2 = datagame.name2
	match.ball.state = 'playing'
	match.save()
	return 200, {"game": match.game, "paddles": match.paddles, "ball": match.ball}

@app.post("delete_match", response={200: SuccessSchema, 400: ErrorSchema}, tags=['Match'])
def delete_match(request, id_match: IdMatchSchema):
	try:
		match = get_object_or_404(RemoteGame, id = id_match.id)
		match.delete()
		return 200, {"msg": "Match deleted"}
	except Exception as e:
		return 400, {"error_msg": "Error deleting match" + str(e)}

@app.get("get_state", response={200: SuccessInitSchema, 400: ErrorSchema}, tags=['Match'])
def get_state(request, id_match: int):
	try:
		match = get_object_or_404(RemoteGame, id = id_match)
		if (match.game.name2 != ''):
			match.ball.state = 'playing'
			return 200, {"game": match.game, "paddles": match.paddles, "ball": match.ball}
	except Exception as e:
		return 400, {"error_msg": "Error getting game state" + str(e)}

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
def get_users(request, user: Optional[int] = None):
	if user:
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
