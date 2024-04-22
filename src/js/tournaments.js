/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tournaments.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 11:49:29 by adpachec          #+#    #+#             */
/*   Updated: 2024/04/22 12:12:27 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import router from "./main.js"
import { getUsernameFromToken } from "./auth.js";

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
        status: 'Ended'
    }
];

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
            </div>
            <div id="tournament-list" class="tournament-list">${viewTournaments()}</div>
        </div>
    `;
    document.getElementById('main-content').innerHTML = tournamentsHTML;
}

function attachEventListeners() {
    document.getElementById('createTournamentBtn').addEventListener('click', showCreateTournamentModal);

    const tournamentEntries = document.querySelectorAll('.tournament-entry');
    tournamentEntries.forEach(entry => {
        entry.querySelector('.tournament-name').addEventListener('click', function() {
            const details = entry.querySelector('.tournament-details');
            details.style.display = details.style.display === 'none' ? 'block' : 'none';
        });
    });
    
    document.addEventListener('click', function(e) {
        const viewBtn = e.target.closest('.view-tournament-btn');
        if (viewBtn) {
            e.preventDefault();
            const tournamentId = viewBtn.getAttribute('data-id');
            router.route(`/tournaments/${tournamentId}`);
        } else if (e.target.classList.contains('join-tournament-btn')) {
            const tournamentName = e.target.getAttribute('data-name');
            joinTournament(tournamentName);
        }
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
                <div>
                <button class="button view-tournament-btn" data-id="${tournament.id}">View Tournament</button>
                    ${tournament.status !== 'In Progress' ? `<button class="button join-tournament-btn" id="join-tournament-btn" data-name="${tournament.name}">Join Tournament</button>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function showCreateTournamentModal() {
    const modal = document.getElementById('createTournamentModal');
    if (!modal) {
        createTournament();
    }
    document.getElementById('createTournamentModal').style.display = 'block';
}

function createTournament() {
    const formHTML = `
    <div id="createTournamentModal" class="modal">
        <div class="modal-content">
            <span class="close-button">×</span>
            <form id="createTournamentForm" class="tournament-form">
                <div class="form-group">
                    <label for="tournamentName">Tournament Name:</label>
                    <input type="text" id="tournamentName" name="tournamentName" required>
                </div>
                <div class="form-group">
                    <label for="numPlayers">Number of Players:</label>
                    <input type="number" id="numPlayers" name="numPlayers" required>
                </div>
                <button type="submit" class="button" id="create-tournament">Create Tournament</button>
            </form>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', formHTML);
    addModalEventListeners();
}
 
function addModalEventListeners() {
    document.querySelector('.close-button').addEventListener('click', function() {
        document.getElementById('createTournamentModal').style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == document.getElementById('createTournamentModal')) {
            document.getElementById('createTournamentModal').style.display = 'none';
        }
    });

    document.getElementById('createTournamentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const tournamentName = document.getElementById('tournamentName').value;
        const numPlayers = document.getElementById('numPlayers').value;
        document.getElementById('createTournamentModal').style.display = 'none';
    });
}

function showNotification(message, isSuccess = true) {
    let notification = document.getElementById('notification');
    if (!notification)
    {
        notification = document.createElement('div');
    }
    notification.id = 'notification';
    notification.textContent = message;
    notification.className = `notification ${isSuccess ? 'success' : 'error'}`;
    document.body.appendChild(notification);
    notification.classList.add('show');
    setTimeout(() =>
    {
        notification.classList.remove('show');
    }, 5000);
}

function joinTournament(tournament) {
    const username = getUsernameFromToken();
    if (username) {
        console.log(`${username} logged in. Joining tournament with name: ${tournament}`);
        showNotification(`${username} joined tournament "${tournament}" successfully!`, true);
    } else {
        console.log('User not logged in. Please log in to join a tournament.');
        showNotification('Please log in to join a tournament.', false);
    }
}

export { loadTournaments, createTournament, joinTournament, viewTournaments};
