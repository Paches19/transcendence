/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tournamentDetails.js                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/16 18:11:12 by adpachec          #+#    #+#             */
/*   Updated: 2024/04/17 13:32:54 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

function loadTournamentDetails(tournament) {
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