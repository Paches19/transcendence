/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   play.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 11:49:24 by adpachec          #+#    #+#             */
/*   Updated: 2024/04/22 13:55:53 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { isLoggedIn } from "./auth.js";
import router from "./main.js";

function initPlayPage() {
    renderGameOptions();
    attachEventListeners();
}

function renderGameOptions() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="play-options-container">
            <div class="play-title"> Elige tu Modo de Juego</div>
            <div class="game-options">
                <button id="solo-vs-ia" class="game-option-button">Solo vs IA</button>
                <button id="local-vs-human" class="game-option-button">Local vs Human</button>
                <button id="remote-vs-human" class="game-option-button">Remote vs Human</button>
                <button id="join-tournament" class="game-option-button">Tournament Game</button>
            </div>
        </div>
    `;
}

function attachEventListeners() {
    document.getElementById('solo-vs-ia').addEventListener('click', () => startGame('solo'));
    document.getElementById('local-vs-human').addEventListener('click', () => startGame('local'));
    document.getElementById('remote-vs-human').addEventListener('click', () => startGame('remote'));
    document.getElementById('join-tournament').addEventListener('click', () => startGame('tournament'));
}

// Funciones para manejar las acciones de cada botón
function startGame(mode) {
     switch (mode){
        case 'solo':
            startSoloVsIA()
            break;
        default:
            console.log(`Sorry ${mode} not configured`);
     }       
}

function startSoloVsIA() {
    if (isLoggedIn()) {
        console.log("Starting game: Solo vs IA");
        showGameScreen();
    } else {
        router.route("/login");
    }
}

function showGameScreen() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="game-container">
            <canvas id="pong-game"></canvas>
            <div class="game-controls">
                <button onclick="pauseGame()">Pause</button>
                <button onclick="quitGame()">Quit</button>
            </div>
        </div>
    `;
    initializeGame();
}

function initializeGame() {
    const canvas = document.getElementById("pong-game");
    if (canvas) {
        console.log("Initialize the Pong game here.");
        // Lógica para iniciar el juego, por ejemplo, configurar el canvas, etc.
    }
}

export default initPlayPage;