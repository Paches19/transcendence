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
    totalPoints: int = 0
    status: bool = 0
    matchesTotal: int = 0
    matchesWon: int = 0
    matchesLost: int = 0
    matchesDraw: int = 0


class LoginSchema(Schema):
    username: str
    password: str


class BasicUserSchema(Schema):
    username: str
    profilePicture: str | None


class UserNameSchema(Schema):
    username: str


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


class UserFriendSchema(Schema):
    id: int
    username: str
    profilePicture: str
    friends: List[FriendSchema]


class UserUpdateSchema(Schema):
    password: str = None
    totalPoints: int = None
    status: bool = None
    matchesTotal: int = None
    matchesWon: int = None
    matchesLost: int = None
    matchesDraw: int = None


class AddFriendSchema(Schema):
    friend_id: int


""" Tournaments schemas """


class TournamentSchema(Schema):
    name: str
    startDate: str = datetime.date.today().isoformat()
    number_participants: int
    status: str


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
    msg: str
