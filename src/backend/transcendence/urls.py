#******************************************************************************#
#                                                                              #
#                                                         :::      ::::::::    #
#    urls.py                                            :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: alaparic <alaparic@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/05/27 12:38:54 by alaparic          #+#    #+#              #
#    Updated: 2024/05/27 12:38:55 by alaparic         ###   ########.fr        #
#                                                                              #
#******************************************************************************#

from django.contrib import admin
from django.urls import path, include
from api.api import app as api_app
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("api/", api_app.urls),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
