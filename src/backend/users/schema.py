# ******************************************************************************#
#                                                                              #
#                                                         :::      ::::::::    #
#    schema.py                                          :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: alaparic <alaparic@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/04/18 13:00:38 by alaparic          #+#    #+#              #
#    Updated: 2024/04/18 13:10:04 by alaparic         ###   ########.fr        #
#                                                                              #
# ******************************************************************************#

from ninja import ModelSchema, Schema
from game.models import User


class UserSchema(ModelSchema):
    class Meta:
        model = User
        fields = '__all__'


class UserCreateSchema(Schema):
    name: str
    password: str
    profilePicture: str = ""
    totalPoints: int = 0
    status: bool = 0
    matchesTotal: int = 0
    matchesWon: int = 0
    matchesLost: int = 0
    matchesDraw: int = 0

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
