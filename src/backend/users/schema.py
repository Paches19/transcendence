from ninja import ModelSchema, Schema
from game.models import User


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


class Error(Schema):
    msg: str
