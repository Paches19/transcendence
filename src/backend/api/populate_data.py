#******************************************************************************#
#                                                                              #
#                                                         :::      ::::::::    #
#    populate_data.py                                   :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: alaparic <alaparic@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/05/27 12:38:12 by alaparic          #+#    #+#              #
#    Updated: 2024/05/27 12:38:13 by alaparic         ###   ########.fr        #
#                                                                              #
#******************************************************************************#

from .models import User, Friend, Match, UserTournament

# Aux functions to populate response fields with data
# They are imported and used in `api.py`


def populate_friends(user):
    all_friends = Friend.objects.all()
    friends = []
    for friend in all_friends:
        if friend.user1.id == user.id:
            friends.append({
                "id": friend.user2.id,
                "name": friend.user2.username,
                "profilePicture": str(friend.user2.profilePicture),
                "status": friend.status
            })
        elif friend.user2.id == user.id:
            friends.append({
                "id": friend.user1.id,
                "name": friend.user1.username,
                "profilePicture": str(friend.user1.profilePicture),
                "status": friend.status
            })
    return friends


def populate_matches(user):
    all_matches = Match.objects.all()
    matches = []
    for match in all_matches:
        if len(matches) >= 10:
            break
        if match.user1.id == user.id or match.user2.id == user.id:
            is_user1 = match.user1.id == user.id
            matches.append({
                "date": str(match.date),
                "opponent": match.user2.username if is_user1 else match.user1.username,
                "result": match.pointsUser1 > match.pointsUser2 if is_user1 else match.pointsUser2 > match.pointsUser1,
                "score": f"{match.pointsUser1} - {match.pointsUser2}" if is_user1 else f"{match.pointsUser2} - {match.pointsUser1}"
            })
    return matches


def populate_tournament_participants(tournament):
    participants = UserTournament.objects.filter(tournament=tournament)
    resp = []
    for participant in participants:
        resp.append({
            "user_id": participant.user.id,
            "username": participant.user.username,
            "profilePicture": str(participant.user.profilePicture)
        })
    return resp


def matches_won(user, tournament):
    matches = Match.objects.filter(
        user1=user, tournamentId=tournament) | Match.objects.filter(user2=user, tournamentId=tournament)
    count = 0
    for match in matches:
        if ((match.user1 == user and match.pointsUser1 > match.pointsUser2) or
                (match.user2 == user and match.pointsUser2 > match.pointsUser1)):
            count += 1
    return count


def populate_standings(tournament):
    participants = UserTournament.objects.filter(tournament=tournament)
    tournament_matches = Match.objects.filter(tournamentId=tournament)
    resp = []
    for participant in participants:
        user_matches = tournament_matches.filter(
            user1=participant.user) | tournament_matches.filter(user2=participant.user)
        resp.append({
            "username": participant.user.username,
            "games_played": user_matches.count(),
            "games_won": matches_won(participant.user, tournament),
            "games_lost": user_matches.count() - matches_won(participant.user, tournament),
            "points_for": sum([match.pointsUser1 if match.user1 == participant.user else match.pointsUser2 for match in user_matches]),
            "points_against": sum([match.pointsUser2 if match.user1 == participant.user else match.pointsUser1 for match in user_matches])
        })
    return resp


def populate_tournament_matches(tournament):
    matches = Match.objects.filter(tournamentId=tournament)
    resp = []
    for match in matches:
        resp.append({
            "player1_username": match.user1.username,
            "player2_username": match.user2.username,
            "player1_points": match.pointsUser1,
            "player2_points": match.pointsUser2,
            "played": (match.pointsUser1 + match.pointsUser2) != 0
        })
    return resp


def userTournamentsPlayed(user):
    tournaments = UserTournament.objects.filter(user=user)
    return len(tournaments)

# Count of the tournaments the user has won, most won games in the tournament


def userTournamentsWon(user):
    tournaments = UserTournament.objects.filter(user=user)
    count = 0
    for tournament in tournaments:
        if tournament.tournament.status != 'ended':
            continue
        tournament_users = UserTournament.objects.filter(
            tournament=tournament.tournament)
        # A dictionary that contains the name of the user and their wins
        players = {}
        # Initialize the dictionary with 0 wins
        for u in tournament_users:
            players[u.user.username] = 0
        matches = Match.objects.filter(tournamentId=tournament.tournament)
        # Count the wins of each player
        for match in matches:
            if match.pointsUser1 > match.pointsUser2:
                players[match.user1.username] += 1
            else:
                players[match.user2.username] += 1
        if players[user.username] == max(players.values()):
            count += 1
    return count
