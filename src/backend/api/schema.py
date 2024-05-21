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
class MatchCreateSchema(Schema):
    id: int


class MatchSchema(Schema):
    user1: int
    y1: int
    pointsUser1: int = 0
    
    user2: int
    y2: int
    pointsUser2: int = 0

    ball_x: int
    ball_y: int
    ball_speed_x: int
    ball_speed_y: int
    
    date: str = datetime.date.today().isoformat()
    tournamentId: int = None
    
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
    matches: List[MatchSchema]


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