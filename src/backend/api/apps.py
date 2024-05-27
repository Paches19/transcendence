#******************************************************************************#
#                                                                              #
#                                                         :::      ::::::::    #
#    apps.py                                            :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: alaparic <alaparic@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/05/27 12:38:04 by alaparic          #+#    #+#              #
#    Updated: 2024/05/27 12:38:05 by alaparic         ###   ########.fr        #
#                                                                              #
#******************************************************************************#

from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'
