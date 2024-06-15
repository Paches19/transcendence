import datetime
from typing import List
from ninja import  Schema

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

class PaddlesSchema(Schema):
	x1: int
	y1: int
	score1: int
	x2: int
	y2: int
	score2: int

class MovePaddlesSchema(Schema):
     msg: str
     paddles: PaddlesSchema

class BallSchema(Schema):
	x: int
	y: int
	vx: int
	vy: int
	state : str
     
class MoveBallSchema(Schema):
     msg: str
     ball: BallSchema

class ScoreSchema(Schema):
	msg: str
	score1: int
	score2: int

class GameSchema(Schema):
	id: int
	v: int
	boundX: int
	boundY: int
	finalScore: int
	playerWidth: int
	playerHeight: int
	ballWidth: int
	ballHeight: int
	name1: str
	name2: str

class InitGameSchema(Schema):
	id : int
	name1: str
	name2: str
	boundX: int
	boundY: int

class KeySchema(Schema):
	keypressed: str

class IdMatchSchema(Schema):
	id: int
    
class SuccessInitSchema(Schema):
	game: GameSchema
	paddles: PaddlesSchema
	ball: BallSchema

class StateSchema(Schema):
	state: str
 
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
    matches: List[GameSchema]


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
