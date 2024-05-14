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

async function fetchTournamentById(id) {
    const apiUrl = `http://localhost:8000/api/tournaments/${id}`;
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const tournament = await response.json();
        return tournament;
    } catch (error) {
        console.error('Error fetching tournament:', error);
        return null;
    }
}

async function loadTournamentDetails(id) {

	let tournament = null;
    try {
        tournament = await fetchTournamentById(id);
    } catch (error) {
        console.error('Error loading tournament:', error);
    }

    const matches = Array.isArray(tournament.matches) ? tournament.matches : [];

    const previousMatches = matches.filter(match => match.played);
    const upcomingMatches = matches.filter(match => !match.played);

	const standings = tournament.standings.map(player => ({
        ...player,
        games_played: Number(player.games_played),
        games_won: Number(player.games_won),
        games_lost: Number(player.games_lost),
        points_for: Number(player.points_for),
        points_against: Number(player.points_against),
    }));

    const sortedStandings = standings.sort((a, b) => {
        if (b.games_won !== a.games_won) {
            return b.games_won - a.games_won;
        }
        return b.points_for - a.points_for;
    });

    const tournamentDetailsHTML = `
    <div class="container mt-5 tournament-details-container">
        <h1 class="text-center mb-3 tournament-header">${tournament.name}</h1>
        <div class="row">
            <div class="col-lg-5">
                <div class="card custom-card mb-4">
                    <div class="card-header custom-card-header">Previous Results</div>
                    <ul class="custom-list-group">
                        ${previousMatches.length > 0 ? `
                            ${previousMatches.map(match => `
                                <li class="list-group-item custom-list-item">
                                    <span class="match-title">${match.player1_username} vs ${match.player2_username}</span>
                                    <span class="match-result">${match.player1_points} - ${match.player2_points}</span>
                                </li>
                            `).join('')}
                        ` : '<li class="list-group-item custom-list-item">No previous matches</li>'}
                    </ul>
                </div>
                <div class="card custom-card mb-4">
                    <div class="card-header custom-card-header">Upcoming Matches</div>
                    <ul class="custom-list-group">
                        ${upcomingMatches.length > 0 ? `
                            ${upcomingMatches.map(match => `
                                <li class="list-group-item custom-list-item">
                                    <span class="match-title">${match.player1_username} vs ${match.player2_username}</span>
                                    <span class="match-result">${match.date}</span>
                                </li>
                            `).join('')}
                        ` : '<li class="list-group-item custom-list-item">No upcoming matches</li>'}
                    </ul>
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
									${sortedStandings.length > 0 ? `
									${sortedStandings.map(player => `
										<tr>
											<td>${player.username}</td>
											<td>${player.games_played}</td>
											<td>${player.games_won}</td>
											<td>${player.games_lost}</td>
											<td>${player.points_for}</td>
											<td>${player.points_against}</td>
										</tr>
									`).join('')}
								` : '<tr><td colspan="6">No standings available</td></tr>'}
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