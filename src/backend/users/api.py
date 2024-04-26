from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from ninja import NinjaAPI, File
from ninja.files import UploadedFile
from game.models import User
from .schema import UserSchema, UserCreateSchema, Error, UserUpdateSchema
import os

MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10MB

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


@app.post("/{user_id}/avatar", response={200: UserSchema, 400: Error})
def update_avatar(request, user_id: int, file: UploadedFile = File(...)):
    avatar_data = file.read()

    # Check image size
    if len(avatar_data) > MAX_IMAGE_SIZE:
        return 400, {"msg": "Image size too large"}

    # Check image format
    if file.content_type not in ["image/jpeg", "image/png", "image/gif"]:
        return 400, {"msg": "Image format not supported"}

    # Save the uploaded image
    file_route = os.path.join(os.getcwd(), "users", "static", "avatars", (str(
        user_id) + "." + str(file.content_type[-4:])))
    file = open(file_route, "wb")
    file.write(avatar_data)
    file.close()

    # Update the user avatar route
    user = get_object_or_404(User, userID=user_id)
    user.profilePicture = file_route
    return user
