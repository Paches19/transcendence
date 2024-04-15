/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tournaments.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 11:49:29 by adpachec          #+#    #+#             */
/*   Updated: 2024/04/15 14:03:24 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { updateTournamentNavbar, restoreOriginalNavbar } from "./navbar.js";

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
        participants: ['Player4', 'Player5', 'Player6'],
        status: 'In Progress'
    }
];

function loadTournaments()
{
    updateTournamentNavbar();

    const tournamentsHTML = `
        <div class="tournament-container">
            <h1>Tournaments</h1>
            <button id="createTournamentBtn">Create Tournament</button>
            <button id="joinTournamentBtn">Join Tournament</button>
            <div id="tournament-list">${viewTournaments()}</div>
        </div>
    `;
    document.getElementById('main-content').innerHTML = tournamentsHTML;
    document.getElementById('createTournamentBtn').addEventListener('click', createTournament);
    document.getElementById('joinTournamentBtn').addEventListener('click', joinTournament);
}

function createTournament()
{
    console.log('Creating a new tournament...');
}

function joinTournament()
{
    console.log('Joining a tournament...');
}

function viewTournaments()
{
    return mockTournaments.map(tournament => `
        <div class="tournament-entry">
            <h3>${tournament.name}</h3>
            <p>Status: ${tournament.status}</p>
            <p>Participants: ${tournament.participants.join(', ')}</p>
        </div>
    `).join('');
}

function unloadTournaments() {
    restoreOriginalNavbar();
}

export { loadTournaments, createTournament, joinTournament, viewTournaments, unloadTournaments };
