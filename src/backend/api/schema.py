from ninja import ModelSchema, Schema
from typing import List
from .models import User
import datetime
from pydantic import BaseModel, ValidationError, model_validator


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
    name: str
    profilePicture: str
    status: bool


class UserFriendSchema(Schema):
    username: str
    profilePicture: str
    password: str
    friends: List[FriendSchema]

    def __init__(self, user, **data):
        super().__init__(**data)
        self.user = user

    @model_validator(mode='before')
    def populate_fields(self, values):  # Add the self parameter
        user = self.user
        if user:
            values['username'] = user.username
            values['password'] = user.password
            values['profilePicture'] = user.profile_picture.url if user.profile_picture else None
            values['friends'] = [FriendSchema.from_orm(friend) for friend in user.user1.all()] + \
                                [FriendSchema.from_orm(friend)
                                 for friend in user.user2.all()]
        return values


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
