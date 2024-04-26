from django.shortcuts import get_object_or_404
from ninja import NinjaAPI, File
from ninja.files import UploadedFile
from game.models import User
from .schema import UserRegisterSchema, LoginSchema, UserSchema, Error
from ninja.security import django_auth
from django.contrib.auth import authenticate, login, logout

app = NinjaAPI()


@app.post("/register", response={200: UserSchema, 400: Error})
def create_user(request, user_in: UserRegisterSchema):
    if User.objects.filter(name=user_in.name).exists():
        return 400, {"msg": "User already exists"}

    user_data = user_in.model_dump()
    user_model = User.objects.create(**user_data)
    return user_model


@app.post('/login')
def login_user(request, login_in: LoginSchema):
    user = authenticate(request, username=login_in.username,
                        password=login_in.password)
    if user is not None:
        login(request, user)
        return {"msg": "Login successful"}
    else:
        return {"msg": "Login failed"}


@app.get("/logout")
def logout_user(request):
    logout(request)
    return {"msg": "Logout successful"}
