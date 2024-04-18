/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tournamentDetails.js                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/16 18:11:12 by adpachec          #+#    #+#             */
/*   Updated: 2024/04/18 17:38:06 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const sampleTournament = {
    name: "Summer Pong Fest",
    upcomingMatches: [
        { match: "Match 1", players: "Player A vs Player B", date: "2024-08-15" },
        { match: "Match 2", players: "Player C vs Player D", date: "2024-08-16" }
    ],
    previousMatches: [
        { match: "Match 1", result: "Player A 21 - 18 Player B" },
        { match: "Match 2", result: "Player D 21 - 15 Player C" }
    ],
    standings: [
        { team: "Player A", played: 2, won: 1, lost: 1, pointsFor: 42, pointsAgainst: 39 },
        { team: "Player B", played: 2, won: 1, lost: 1, pointsFor: 39, pointsAgainst: 42 },
        { team: "Player A", played: 2, won: 1, lost: 1, pointsFor: 42, pointsAgainst: 39 },
        { team: "Player B", played: 2, won: 1, lost: 1, pointsFor: 39, pointsAgainst: 42 }
    ]
};

function loadTournamentDetails(tournament) {
	tournament = sampleTournament;
    const tournamentDetailsHTML = `
		<div class="container mt-5 tournament-details-container">
		<h1 class="text-center mb-3 tournament-header">${tournament.name}</h1>
		<div class="row">
			<div class="col-lg-5">
				<div class="card custom-card mb-4">
					<div class="card-header custom-card-header">Previous Results</div>
						${tournament.previousMatches && tournament.previousMatches.length > 0 ? `
							${tournament.previousMatches.map(match => `
							<li class="list-group-item custom-list-item">
								<span class="match-title">${match.match}</span>
								<span class="match-result">${match.result} </span>
								</li>
							`).join('')}
						` : '<li class="list-group-item custom-list-item">No previous matches</li>'}	
				</div>
				<div class="card custom-card" mb-4>
					<div class="card-header custom-card-header">Upcoming Matches</div>
					${tournament.upcomingMatches && tournament.upcomingMatches.length > 0 ? `
						${tournament.upcomingMatches.map(match => `
						<li class="list-group-item custom-list-item">
							<span class="match-title">${match.match}</span>
							<span class="match-result">${match.players}</span>
							<span class="match-result">${match.date}</span>
						</li>
						`).join('')}
					` : '<li class="list-group-item custom-list-item">No upcoming matches</li>'}
				</div>
			</div>
			<div class="col-md-12 col-lg-7">
				<div class="card custom-card">
					<div class="card-header custom-card-header">Standings</div>
					<div class="card-body">
						<div class="table-responsive">
						<table class="table table-light table-hover table-striped custom-table">
							<thead>
								<tr>
									<th>Player</th>
									<th>Games Played</th>
									<th>Games Won</th>
									<th>Games Lost</th>
									<th>Points For</th>
									<th>Points Against</th>
								</tr>
							</thead>
							<tbody>
								${tournament.standings.map(team => `
									<tr>
										<td>${team.team}</td>
										<td>${team.played}</td>
										<td>${team.won}</td>
										<td>${team.lost}</td>
										<td>${team.pointsFor}</td>
										<td>${team.pointsAgainst}</td>
									</tr>
								`).join('')}
							</tbody>
						</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
    `;
    document.getElementById('main-content').innerHTML = tournamentDetailsHTML;
}

export default loadTournamentDetails;