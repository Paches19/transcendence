from django.shortcuts import get_object_or_404
from ninja import NinjaAPI
from game.models import User
from .schema import UserSchema, UserCreateSchema, Error, UserUpdateSchema

app = NinjaAPI()


@app.get("", response=list[UserSchema])
def get_users(request):
    return User.objects.all()


@app.get("/{user_id}", response=UserSchema)
def get_user(request, user_id: int):
    user = get_object_or_404(User, userID=user_id)
    return user


@app.post("", response={200: UserSchema, 400: Error})
def create_user(request, user_in: UserCreateSchema):
    if User.objects.filter(name=user_in.name).exists():
        return 400, {"msg": "User already exists"}

    user_data = user_in.model_dump()
    user_model = User.objects.create(**user_data)
    return user_model


@app.post("/{user_id}/update", response={200: UserSchema, 400: Error})
def update_user(request, user_id: int, user_in: UserUpdateSchema):
    user = get_object_or_404(User, userID=user_id)
    user_data = user_in.dict()
    for key, value in user_data.items():
        if value is not None:
            setattr(user, key, value)
    user.save()
    return user