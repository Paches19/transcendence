#******************************************************************************#
#                                                                              #
#                                                         :::      ::::::::    #
#    dbUpdate.py                                        :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: alaparic <alaparic@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/05/27 18:42:57 by alaparic          #+#    #+#              #
#    Updated: 2024/05/27 18:42:58 by alaparic         ###   ########.fr        #
#                                                                              #
#******************************************************************************#

from api.models import Match, User, Friend, Tournament
from api.schema import UpdateMatchSchema, UserStatsSchema, TournamentEndedSchema


def updateMatchData(UpdateMatchSchema: UpdateMatchSchema):
    match = Match.objects.get(matchID=UpdateMatchSchema.matchID)
    match.pointsUser1 = UpdateMatchSchema.pointsUser1
    match.pointsUser2 = UpdateMatchSchema.pointsUser2
    match.save()


def updateTournamentData(TournamentEndedSchema: TournamentEndedSchema):
    tournament = Tournament.objects.get(
        tournamentID=TournamentEndedSchema.tournamentID)
    tournament.status = "ended"
    tournament.save()


def updateUserStats(UserStatsSchema: UserStatsSchema):
    user = User.objects.get(id=UserStatsSchema.id)
    user.totalPoints += UserStatsSchema.points
    user.matchesTotal += 1
    if UserStatsSchema.won:
        user.matchesWon += 1
    else:
        user.matchesLost += 1
    user.save()
