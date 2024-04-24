/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   profile.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 11:49:18 by adpachec          #+#    #+#             */
/*   Updated: 2024/04/24 13:16:28 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// Simulación de petición Fetch para obtener datos del perfil del usuario
/*
fetch('/api/user/profile', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('userToken')}`
    }
})
.then(response => response.json())
.then(data => {
    console.log(data);
    // Actualizar el DOM con los datos recibidos
})
.catch(error => console.error('Error:', error));
*/

import { isLoggedIn } from './auth.js';
import router from './main.js';

const mockUser =
{
	username: "user1",
	avatar: "./images/avatar/author_1.png",
	gamesPlayed: 150,
	gamesWon: 100,
	gamesLost: 50,
	pointsFor: 1200,
	pointsAgainst: 800,
	tournamentsPlayed: 10,
	tournamentsWon: 5,
	matchHistory:
	[
		{ date: "04/07/2024", opponent: "Player42", result: "Win", score: "21-15" },
		{ date: "04/09/2024", opponent: "ArcadeMaster", result: "Loss", score: "18-21" },
		{ date: "04/12/2024", opponent: "PixelNinja", result: "Win", score: "21-10" }
	]
};

const mockFriends =
[
    { username: "ArcadeMaster", avatar: "./images/avatar/author_2.png" },
    { username: "PongChamp", avatar: "./images/avatar/author_3.png" },
    { username: "RetroGamer42", avatar: "./images/avatar/author_3.png" },
	{ username: "Jutrera", avatar: "./images/avatar/author_2.png" }
];
  
function loadProfile()
{
	
	if (!isLoggedIn())
	{
		localStorage.setItem('loginRedirect', 'true');
		router.route('/login');
		return ;
	}
	
	const profileHTML = `
		<div class="profile-container">
			<div class="profile-header">
				<img src="${mockUser.avatar}" class="profile-avatar" alt="Avatar del usuario">
				<h2 class="profile-username">${mockUser.username}</h2>
			</div>
			<div class="profile-stats">
				<button class="stats-toggler">Stats</button>
				<div class="stats-content" style="display: none;>
					<p>Matches Played: ${mockUser.gamesPlayed}</p>
					<p>Matches Won: ${mockUser.gamesWon}</p>
					<p>Matches Lost: ${mockUser.gamesLost}</p>
					<p>Points Scored: ${mockUser.pointsFor}</p>
					<p>Points Against: ${mockUser.pointsAgainst}</p>
					<p>Tournaments Played: ${mockUser.tournamentsPlayed}</p>
					<p>Tournaments Won: ${mockUser.tournamentsWon}</p>
				</div>
			</div>
			<div class="profile-history">
				<button class="history-toggler">Match history</button>
				<div class="history-content" style="display: none;">
					${renderMatchHistory(mockUser.matchHistory)}
				</div>
			</div>
			<button class="friends-button" id="friends-button">Friends</button>
			<div class="friends-section" id="friends-section" style="display: none;">
				<div id="friends-list" class="friends-list">
					
				</div>
				<button class="toggle-button" id="toggle-friend-form">Add a New Friend</button>
				<div id="add-friend-form" class="add-friend-form" style="display: none;">
					<input type="text" id="new-friend-name" placeholder="Enter friend's username" />
					<button id="sendRequestBtn">Send Friend Request</button>
				</div>
			</div>
		</div>
		`;

	document.getElementById('main-content').innerHTML = profileHTML;
	initializeFriendsList();
    addEventListeners();

	function renderMatchHistory(matches)
	{
		return `
			<table class="table table-dark table-striped">
			<thead>
				<tr>
				<th>Date</th>
				<th>Opponent</th>
				<th>Result</th>
				<th>Score</th>
				</tr>
			</thead>
			<tbody>
				${matches.map(match => `
				<tr>
					<td>${match.date}</td>
					<td>${match.opponent}</td>
					<td class="${match.result === 'Win' ? 'win' : 'loss'}">${match.result}</td>
					<td>${match.score}</td>
				</tr>
				`).join('')}
			</tbody>
			</table>
		`;
	}
	
	function initializeFriendsList()
	{
		const friendsList = document.getElementById('friends-list');
		mockFriends.forEach(friend => {
			const friendEntry = document.createElement('div');
			friendEntry.classList.add('friend-entry');
			const link = document.createElement('a');
			link.href = `/${friend.username}`;
			link.innerHTML = `
				<img src="${friend.avatar}" alt="${friend.username}'s Avatar" class="friend-avatar">
				<span class="friend-username">${friend.username}</span>
			`;
			link.addEventListener('click', (e) => {
				e.preventDefault();
				loadFriendProfile(friend.username);
			});
			friendEntry.appendChild(link);
			friendsList.appendChild(friendEntry);
		});
	}
	
	function loadFriendProfile(username) {
		alert(`Load profile for ${username}`);
		// router.route('profile', username); 
	}
	
	function addEventListeners() {
		document.querySelector('.stats-toggler').addEventListener('click', toggleStats);
		document.querySelector('.history-toggler').addEventListener('click', toggleHistory);
		document.getElementById('friends-button').addEventListener('click', toggleFriendSection);
		document.getElementById('toggle-friend-form').addEventListener('click', toggleFriendForm);
		document.getElementById('sendRequestBtn').addEventListener('click', sendFriendRequest);
	}
	
	function toggleStats() {
		const statsContent = document.querySelector('.stats-content');
		statsContent.style.display = statsContent.style.display === 'none' ? 'block' : 'none';
	}
	
	function toggleHistory() {
		const historyContent = document.querySelector('.history-content');
		historyContent.style.display = historyContent.style.display === 'none' ? 'block' : 'none';
	}
	
	function toggleFriendSection() {
		const section = document.getElementById('friends-section');
		section.style.display = section.style.display === 'none' ? 'block' : 'none';
	}

	function toggleFriendForm() {
		const form = document.getElementById('add-friend-form');
		form.style.display = form.style.display === 'none' ? 'block' : 'none';
	}
	
	function sendFriendRequest()
	{
		const friendUsernameInput = document.getElementById('new-friend-name');
		const friendUsername = friendUsernameInput.value.trim();
		if (friendUsername)
		{
			console.log(`Sending friend request to ${friendUsername}`);
			updateFriendsList(friendUsername);
			friendUsernameInput.value = "";
			showNotification(`Friend request sent to ${friendUsername}`);
		}
		else
		{
			alert("Please enter a friend's username.");
		}
	}
	
	function updateFriendsList(friendUsername)
	{
		const friendsList = document.getElementById('friends-list');
		const friendEntry = document.createElement('div');
		friendEntry.innerText = friendUsername;
		friendsList.appendChild(friendEntry);
	}

	function showNotification(message) {
		let notification = document.getElementById('notification');
		if (!notification)
		{
			notification = document.createElement('div');
			notification.id = 'notification';
			notification.className = 'notification';
			document.body.appendChild(notification);
		}
		notification.textContent = message;
		
		notification.classList.add('show');
		setTimeout(() =>
		{
			notification.classList.remove('show');
		}, 4000);
	}
}

export default loadProfile;