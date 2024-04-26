from ninja import ModelSchema, Schema
from game.models import User


""" User schemas """


class UserSchema(ModelSchema):
    class Meta:
        model = User
        fields = '__all__'


class UserUpdateSchema(Schema):
    password: str = None
    profilePicture: str = None
    totalPoints: int = None
    status: bool = None
    matchesTotal: int = None
    matchesWon: int = None
    matchesLost: int = None
    matchesDraw: int = None


""" Auth schemas """


class UserRegisterSchema(Schema):
    name: str
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


""" General schemas """


class ErrorSchema(Schema):
    msg: str
