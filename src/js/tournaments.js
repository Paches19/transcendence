/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tournaments.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 11:49:29 by adpachec          #+#    #+#             */
/*   Updated: 2024/04/17 13:16:51 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import loadTournamentDetails from "./tournamentDetails.js";

const mockTournaments = [
    {
        id: 1,
        name: 'Spring Pong Championship',
        participants: ['Player1', 'Player2', 'Player3'],
        status: 'Upcoming'
    },
    {
        id: 2,
        name: 'Summer Pong Fest',
        participants: ['Player4', 'Player5', 'Player6', 'Player4', 'Player5', 'Player6', 'Player4', 'Player5', 'Player6', 'Player4', 'Player5', 'Player6', 'Player4', 'Player5', 'Player6', 'Player4', 'Player5', 'Player6'],
        status: 'In Progress'
    },
	{
        id: 3,
        name: 'Spring Pong Championship',
        participants: ['Player1', 'Player2', 'Player3'],
        status: 'Upcoming'
    },
    {
        id: 4,
        name: 'Summer Pong Fest',
        participants: ['Player4', 'Player5', 'Player6'],
        status: 'In Progress'
    },
	{
        id: 5,
        name: 'Spring Pong Championship',
        participants: ['Player1', 'Player2', 'Player3'],
        status: 'Upcoming'
    },
    {
        id: 6,
        name: 'Summer Pong Fest',
        participants: ['Player4', 'Player5', 'Player6'],
        status: 'In Progress'
    }
];

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

function loadTournaments() {
    updateTournamentHTML();
    attachEventListeners();
}
function updateTournamentHTML() {
    const tournamentsHTML = `
        <div class="tournament-container">
            <h1 class="tournament-title">Tournaments</h1>
            <div class="btn-group" role="group" aria-label="Tournament Actions">
                <button class="button" id="createTournamentBtn">Create Tournament</button>
                <button class="button" id="joinTournamentBtn">Join Tournament</button>
            </div>
            <div id="tournament-list" class="tournament-list">${viewTournaments()}</div>
        </div>
    `;
    document.getElementById('main-content').innerHTML = tournamentsHTML;
}

function attachEventListeners() {
    document.getElementById('createTournamentBtn').addEventListener('click', createTournament);
    document.getElementById('joinTournamentBtn').addEventListener('click', joinTournament);

	document.addEventListener('click', function(e) {
		if (e.target.classList.contains('view-tournament-btn')) {
			//const tournamentName = e.target.closest('.tournament-entry').querySelector('.tournament-name').textContent;
			loadTournamentDetails(sampleTournament);
		}
	});

    const tournamentEntries = document.querySelectorAll('.tournament-entry');
    tournamentEntries.forEach(entry => {
        entry.querySelector('.tournament-name').addEventListener('click', function() {
            const details = entry.querySelector('.tournament-details');
            details.style.display = details.style.display === 'none' ? 'block' : 'none';
        });
    });
}

function viewTournaments() {
    return mockTournaments.map(tournament => `
        <div class="tournament-entry">
            <h3 class="tournament-name">${tournament.name}</h3>
            <div class="tournament-details" style="display: none;">
                <p>Status: ${tournament.status}</p>
                <div class="participants-container">
                    <h4 class="participants-title">Participants</h4>
                    <div class="participants-list">
                        ${tournament.participants.map(participant => `
                            <span class="participant-name">${participant}</span>
                        `).join('')}
                    </div>
                </div>
                <button class="button view-tournament-btn">View Tournament</button>
            </div>
        </div>
    `).join('');
}

function createTournament()
{
    console.log('Creating a new tournament...');
}

function joinTournament()
{
    console.log('Joining a tournament...');
}

export { loadTournaments, createTournament, joinTournament, viewTournaments};
