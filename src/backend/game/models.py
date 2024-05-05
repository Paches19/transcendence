# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    models.py                                          :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: jutrera- <jutrera-@student.42madrid.com    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/04/15 12:03:07 by alaparic          #+#    #+#              #
#    Updated: 2024/05/04 20:30:15 by jutrera-         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from django.db import models

class Match(models.Model):
     id = models.AutoField(primary_key=True)

