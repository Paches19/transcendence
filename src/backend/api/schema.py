from pydantic import BaseModel, ValidationError, model_validator
import datetime
from .models import User
from typing import List
from ninja import ModelSchema, Schema

""" Auth schemas """


class UserRegisterSchema(Schema):
    username: str
    password: str
    profilePicture: str = "/static/avatars/default.jpg"


class LoginSchema(Schema):
    username: str
    password: str

""" User schemas """


class FriendSchema(Schema):
    id: int
    name: str
    profilePicture: str
    status: bool


""" Match schemas """

class GameStatusSchema(Schema):
	id: int
	v: int = 0
	key: str = ''
	ballWidth: int = 10
	ballHeight: int = 10
	playerWidth: int = 15
	playerHeight: int = 80
	finalScore: int = 3
	x1: int = 0
	y1: int = 0
	score1: int = 0
	name1: str = 'Player1'
	x2: int = 0
	y2: int = 0
	score2: int = 0
	name2: str = 'Player2'
	ballX: int = 0
	ballY: int = 0
	ballSpeedX: int = 0
	ballSpeedY: int = 0
	boundX: int = 0
	boundY: int = 0
	state: str = 'waiting'
	modality: str = ''

""" User schemas """

class UserSchema(Schema):
    id: int
    username: str
    profilePicture: str
    totalPoints: int
    status: bool
    matchesTotal: int
    matchesWon: int
    matchesLost: int
    tournamentsPlayed: int
    tournamentsWon: int
    friends: List[FriendSchema]
    matches: List[GameStatusSchema]


class UserUpdateSchema(Schema):
    username: str = None
    password: str = None


class UserNameSchema(Schema):
    username: str


class AddFriendSchema(Schema):
    friend_username: str


""" Tournaments schemas """


class TournamentCreateSchema(Schema):
    name: str
    number_participants: int


class UserTournamentSchema(Schema):
    user_id: int
    username: str
    profilePicture: str


class TournamentSchema(Schema):
    id: int
    name: str
    date: str = datetime.date.today().isoformat()
    status: str
    number_participants: int
    participants: List[UserTournamentSchema]


class StandingsSchema(Schema):
    username: str
    games_played: int
    games_won: int
    games_lost: int
    points_for: int
    points_against: int


class MatchInfoSchema(Schema):
    player1_username: str
    player2_username: str
    player1_points: int
    player2_points: int
    played: bool


class SingleTournamentSchema(Schema):
    id: int
    name: str
    date: str
    status: str
    number_participants: int
    participants: List[UserTournamentSchema]
    standings: List[StandingsSchema]
    matches: List[MatchInfoSchema]


class TournamentNameSchema(Schema):
    id: int
    name: str


""" General schemas """


class ErrorSchema(Schema):
    error_msg: str


class SuccessSchema(Schema):
    msg: str