from ninja import ModelSchema, Schema
from game.models import User


class UserSchema(ModelSchema):
    class Meta:
        model = User
        fields = '__all__'


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

class Error(Schema):
    msg: str
