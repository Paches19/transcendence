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
