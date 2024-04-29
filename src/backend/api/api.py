import os
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout
from ninja import NinjaAPI, File
from ninja.files import UploadedFile
from .models import User, Friend
from .middleware import require_auth
from .schema import (UserSchema, ErrorSchema, UserUpdateSchema,
                     UserRegisterSchema, LoginSchema, UserUpdatePassSchema, AddFriendSchema)

MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10MB

app = NinjaAPI(
    title="ft_transcendence API",
    version="1.0",
    description="API for the ft_transcendence project made with the django-ninja library.",
)

""" Auth """


@app.post("auth/register", response={200: UserSchema, 400: ErrorSchema})
def create_user(request, user_in: UserRegisterSchema):
    if User.objects.filter(name=user_in.name).exists():
        return 400, {"msg": "User already exists"}

    user_data = user_in.model_dump()
    user_model = User.objects.create(**user_data)
    return user_model


@app.post("auth/login")
def login_user(request, login_in: LoginSchema):
    user = authenticate(request, username=login_in.username,
                        password=login_in.password)
    if user is not None:
        login(request, user)
        return {"msg": "Login successful"}
    else:
        return {"msg": "Login failed"}


@app.get("auth/logout")
def logout_user(request):
    logout(request)
    return {"msg": "Logout successful"}


@app.get("auth/password/change", response={200: UserSchema, 400: ErrorSchema})
def change_password(request, user_id: int, pass_in: UserUpdatePassSchema):
    user = get_object_or_404(User, userID=user_id)
    if not user.check_password(pass_in.password):
        return 400, {"msg": "Incorrect password"}
    user.set_password(pass_in.new_password)
    user.save()


""" Users """


@app.get("users", response=list[UserSchema])
def get_users(request):
    return User.objects.all()


@app.get("users/{user_id}", response=UserSchema)
def get_user(request, user_id: int):
    user = get_object_or_404(User, userID=user_id)
    return user


@app.post("users/{user_id}/update", response={200: UserSchema, 400: ErrorSchema})
def update_user(request, user_id: int, user_in: UserUpdateSchema):
    user = get_object_or_404(User, userID=user_id)
    user_data = user_in.dict()
    for key, value in user_data.items():
        if value is not None:
            setattr(user, key, value)
    user.save()
    return user


@app.post("users/{user_id}/avatar", response={200: UserSchema, 400: ErrorSchema})
def update_avatar(request, user_id: int, file: UploadedFile = File(...)):
    avatar_data = file.read()

    # Check image size
    if len(avatar_data) > MAX_IMAGE_SIZE:
        return 400, {"msg": "Image size too large"}
    if len(avatar_data) == 0:
        return 400, {"msg": "Empty image"}

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


@app.post("users/{user_id}/friends/add", response={200: UserSchema, 400: ErrorSchema})
def add_friend(request, user_id: int, friend_in: AddFriendSchema):

    user = get_object_or_404(User, userID=user_id)
    friend = get_object_or_404(User, userID=friend_in.friend_id)

    friend_data = {
        "user1": user,
        "user2": friend
    }

    Friend.objects.create(**friend_data)
    return 200, {"msg": "Friend request sent"}


@app.post("users/{user_id}/friends/accept", response={200: UserSchema, 400: ErrorSchema})
def accept_friend(request, user_id: int, friend_in: AddFriendSchema):
    user = get_object_or_404(User, userID=user_id)
    friend = get_object_or_404(User, userID=friend_in.friend_id)

    if not Friend.objects.filter(user1=user, user2=friend, status=False).exists():
        return 400, {"msg": "Friend request not found"}

    friendship = get_object_or_404(Friend, user1=user, user2=friend)
    friendship.status = True
    friendship.save()
    return 200, {"msg": "Friend request accepted"}


@app.post("users/{user_id}/friends/remove", response={200: UserSchema, 400: ErrorSchema})
def remove_friend(request, user_id: int, friend_in: AddFriendSchema):
    user = get_object_or_404(User, userID=user_id)
    friend = get_object_or_404(User, userID=friend_in.friend_id)

    if not Friend.objects.filter(user1=user, user2=friend).exists() and not Friend.objects.filter(user1=friend, user2=user).exists():
        return 400, {"msg": "Friend not found"}

    user.friends.remove(friend)
    return user


""" Game """
