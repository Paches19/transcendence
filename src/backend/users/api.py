from django.shortcuts import get_object_or_404
from ninja import NinjaAPI
from game.models import User
from .schema import UserSchema, UserCreateSchema

app = NinjaAPI()


@app.get("", response=list[UserSchema])
def get_users(request):
    return User.objects.all()


@app.get("/{user_id}", response=UserSchema)
def get_user(request, user_id: int):
    user = get_object_or_404(User, userID=user_id)
    return user


@app.post("", response=UserSchema)
def create_user(request, user_in: UserCreateSchema):
    user_data = user_in.model_dump()
    user_model = User.objects.create(**user_data)
    return user_model
