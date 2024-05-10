from pydantic import BaseModel, ValidationError, model_validator
import datetime
from .models import User
from typing import List
from ninja import ModelSchema, Schema

""" Auth schemas """


class UserRegisterSchema(Schema):
    username: str
    password: str
    profilePicture: str = ""


class LoginSchema(Schema):
    username: str
    password: str


class BasicUserSchema(Schema):
    username: str
    profilePicture: str | None


""" User schemas """


class UserSchema(ModelSchema):
    class Meta:
        model = User
        fields = '__all__'
        exclude = ['first_name', 'last_name', 'email', "user_permissions", "groups",
                   "is_staff", "is_active", "is_superuser", "last_login", "date_joined"]


class FriendSchema(Schema):
    id: int
    name: str
    profilePicture: str
    status: bool


class MatchSchema(Schema):
    date: str
    opponent: str
    result: bool
    score: str


class UserFriendSchema(Schema):
    id: int
    username: str
    profilePicture: str
    totalPoints: int
    status: bool
    matchesTotal: int
    matchesWon: int
    matchesLost: int
    matchesDraw: int
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


class TournamentSchema(Schema):
    name: str
    date: str = datetime.date.today().isoformat()
    status: str
    number_participants: int
    participants: List[UserTournamentSchema]


class TournamentNameSchema(Schema):
    id: int
    name: str


""" Match schemas """


class MatchSchema(Schema):
    user1: int
    user2: int
    pointsUser1: int = 0
    pointsUser2: int = 0
    date: str = datetime.date.today().isoformat()
    tournamentId: int = None


""" General schemas """


class ErrorSchema(Schema):
    error_msg: str


class SuccessSchema(Schema):
    msg: str
