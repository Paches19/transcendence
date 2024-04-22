#******************************************************************************#
#                                                                              #
#                                                         :::      ::::::::    #
#    api.py                                             :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: alaparic <alaparic@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/04/18 13:02:06 by alaparic          #+#    #+#              #
#    Updated: 2024/04/21 19:30:50 by alaparic         ###   ########.fr        #
#                                                                              #
#******************************************************************************#

from ninja import NinjaAPI
from game.models import User
from .schema import UserSchema

app = NinjaAPI()


@app.get("", response=list[UserSchema])
def get_users(request):
    return User.objects.all()
