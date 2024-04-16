/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tournamentDetails.js                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/16 18:11:12 by adpachec          #+#    #+#             */
/*   Updated: 2024/04/16 19:08:06 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

function loadTournamentDetails(tournament) {
    const tournamentDetailsHTML = `
	<div class="container mt-5" custom-container>
	<h1 class="text-center mb-3 custom-title">${tournament.name}</h1>
		<div class="row">
			<div class="col-lg-6 mb-4">
				<div class="card custom-card">
					<div class="card-header custom-card-header">Upcoming Matches</div>
					<ul class="list-group list-group-flush custom-list-group">
						${tournament.upcomingMatches.map(match => `
							<li class="list-group-item custom-list-item">${match.match}: ${match.players} - ${match.date}</li>
						`).join('')}
					</ul>
				</div>
			</div>
			<div class="col-lg-6 mb-4">
				<div class="card custom-card">
					<div class="card-header custom-card-header">Standings</div>
						<div class="card-body">
							<table class="table custom-table">
								<thead>
									<tr>
										<th>Team</th>
										<th>Played</th>
										<th>Won</th>
										<th>Lost</th>
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