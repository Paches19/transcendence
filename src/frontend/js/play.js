/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   play.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 11:49:24 by adpachec          #+#    #+#             */
/*   Updated: 2024/06/13 12:26:11 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { isLoggedIn, getUsernameFromToken } from "./auth.js";
//import router from "./main.js";

let selectedMatchID = null;

function initPlayPage() {
    renderGameOptions();
    attachEventListeners();
}

function renderGameOptions() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="play-wrapper">
            <div class="play-options-container text-center mt-5">
                <h1 class="play-title mb-4">Elige tu Modo de Juego</h1>
                <div class="play-btn-group">
                    <button id="solo-vs-ai" class="play-btn play-btn-primary">Solo vs AI</button>
                    <button id="local-vs-human" class="play-btn play-btn-light">Local vs Human</button>
                    <button id="remote-vs-human" class="play-btn play-btn-success">Remote vs Human</button>
                </div>
            </div>
        </div>
    `;
}

function attachEventListeners() {
    document.getElementById('local-vs-human').addEventListener('click', showMatchTypeOptions);
}

function showMatchTypeOptions() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="play-wrapper">
            <div class="play-title">Select Match Type</div>
            <div class="play-btn-group">
                <button id="normal-match" class="play-btn play-btn-primary">Normal Match</button>
                <button id="tournament-match" class="play-btn play-btn-success">Tournament Match</button>
            </div>
        </div>
    `;

    document.getElementById('normal-match').addEventListener('click', loadLogin);
    document.getElementById('tournament-match').addEventListener('click', handleLocalVsHumanClick);
}

async function handleLocalVsHumanClick() {

    const apiUrl = 'https://localhost/api/tournaments/user/matches';
  
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    };
    
    try {
        const response = await fetch(apiUrl, requestOptions);
        if (response.ok) {
            const matches = await response.json();
            showMatchOptions(matches);
        } else {
            showNotification('Error fetching matches. Please try again later.', false);
        }
    } catch (error) {
        showNotification('Error fetching matches. Please try again later.', false);
    }
}

function showMatchOptions(matches) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="play-wrapper">
            <div class="play-title">Select a Match</div>
            <ul id="match-list" class="match-list">
                ${matches.map(match => `
                    <li class="match-item">
                        <div class="match-header">
                            <div class="tournament-name">${match.tournamentName}</div>
                        </div>
                        <div class="match-details">
                            <span class="match-info">${match.player1_username} vs ${match.player2_username}</span>
                            <button class="play-btn play-btn-primary select-match-btn" data-match-id="${match.matchID}">Select</button>
                        </div>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;

    const matchButtons = document.querySelectorAll('.select-match-btn');
    matchButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            selectedMatchID = event.target.getAttribute('data-match-id');
            loadLogin();
        });
    });
}

function loadLogin() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="wrapper">
            <div class="flip-card__inner">
                <div class="flip-card__front">
                    <div class="title">Log in</div>
                        <form action="" class="flip-card__form" id="login-form">
                            <input type="text" placeholder="Name" id="userName" class="flip-card__input">
                            <input type="password" placeholder="Password" id="password" class="flip-card__input">
                            <button type="submit" class="flip-card__btn" id="login-btn">Start Game!</button>
                            <div class="text" id="login-msg"> </div>
                        </form>
                </div>
            </div>   
        </div>
    `;

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', handleLoginSubmit);
}

async function handleLoginSubmit(event) {
    event.preventDefault();

    console.log("selectedID: ", selectedMatchID);

    const apiUrl = '/api/auth/login/local_match';
    const requestBody = {
        player2_username: document.getElementById('userName').value,
        player2_password: document.getElementById('password').value,
        matchID: selectedMatchID ? selectedMatchID : -1
    };

    console.log("requestBody: ", requestBody);
  
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        credentials: 'include'
    };

    try {
        const response = await fetch(apiUrl, requestOptions);

        if (response.ok) {
            const data = await response.json();
            showStartGameButton();
        } else {
            const errorData = await response.json();
            document.getElementById('login-msg').textContent = `Error: ${errorData.message}`;
        }
    } catch (error) {
        document.getElementById('login-msg').textContent = 'Error logging in. Please try again later.';
    }
}

function showStartGameButton() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML += `
        <button id="start-game-btn" class="flip-card__btn btn btn-success play-btn mt-3">Start Game</button>
    `;

    const startGameButton = document.getElementById('start-game-btn');
    startGameButton.addEventListener('click', startGameBtn);
}

async function startGameBtn() {
    // const endpoint = selectedMatchID ? `/api/tournaments/${selectedMatchID}/start` : `/api/matches/start`;
    
    // try {
    //     const response = await fetch(endpoint, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     });

    //     if (response.ok) {
    //         const data = await response.json();
    //         // Initialize the game with the match ID if available
    //         console.log('Starting game with match ID:', selectedMatchID || 'Normal match');
    //     } else {
    //         const errorData = await response.json();
    //         showNotification(`Error: ${errorData.message}`, false);
    //     }
    // } catch (error) {
    //     showNotification('Error starting game. Please try again later.', false);
    // }
    showNotification(`Game starting`, true);
}

function showNotification(message, isSuccess = true) {
    let notification = document.getElementById('notification');
    if (notification) {
        notification.remove();
    }
    notification = document.createElement('div');
    notification.id = 'notification';
    notification.textContent = message;
    notification.className = `notification ${isSuccess ? true : false}`;

    document.body.appendChild(notification);
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
}

export default initPlayPage;