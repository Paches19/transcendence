/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   play.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 11:49:24 by adpachec          #+#    #+#             */
/*   Updated: 2024/04/22 18:32:11 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { isLoggedIn, getUsernameFromToken } from "./auth.js";
import router from "./main.js";

function initPlayPage() {
    renderGameOptions();
    attachEventListeners();
}

function renderGameOptions() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
    <div class="play-options-container text-center mt-5">
        <h1 class="play-title mb-4">Elige tu Modo de Juego</h1>
        <div class="game-options btn-group">
            <button id="solo-vs-ia" class="btn btn-primary game-option-button">Solo vs IA</button>
            <button id="local-vs-human" class="btn btn-light game-option-button">Local vs Human</button>
            <button id="remote-vs-human" class="btn btn-success game-option-button">Remote vs Human</button>
            <button id="join-tournament" class="btn btn-info game-option-button">Tournament Game</button>
        </div>
    </div>
    `;
}

function startGame(mode) {
    switch (mode){
       case 'solo':
           startSoloVsIA()
           break;
       default:
           console.log(`Sorry ${mode} not configured`);
    }       
}

function attachEventListeners() {
    document.getElementById('solo-vs-ia').addEventListener('click', () => startGame('solo'));
    document.getElementById('local-vs-human').addEventListener('click', () => startGame('local'));
    document.getElementById('remote-vs-human').addEventListener('click', () => startGame('remote'));
    document.getElementById('join-tournament').addEventListener('click', () => startGame('tournament'));
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
    const username = getUsernameFromToken();
    mainContent.innerHTML = `
    <div class="container mt-5 game-container">
        <div class="row align-items-center">
            <div class="col-12 col-lg-8 mx-auto">
                <div class="bg-dark text-white p-3 rounded-3">
                    <div class="d-flex justify-content-between mb-2">
                        <h2 id="game-score" class="mb-0">${username} 0 - 0 Mark (IA)</h2>
                        <h3 id="game-timer" class="mb-0">00:00</h3>
                    </div>
                    <canvas id="pong-game" class="w-100"></canvas>
                </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12 text-center">
                <button class="btn btn-success btn-lg mx-2" id="restart-game">Restart</button>
                <button class="btn btn-danger btn-lg mx-2" id="quit-game">Quit</button>
            </div>
        </div>
    </div>
    `;
    initializeGame();
    attachGameControlEventListeners();
}

function initializeGame() {
    const canvas = document.getElementById("pong-game");
    if (canvas) {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        const context = canvas.getContext('2d');
        context.fillStyle = '#000';
        context.fillRect(0, 0, canvas.width, canvas.height);
        startTimer();
        console.log("Pong game initialized.");
    }
}

function resizeCanvas() {
    const canvas = document.getElementById("pong-game");
    const container = document.querySelector('.game-container');
    if (canvas && container) {
        const width = container.clientWidth;
        const height = Math.max(width * 0.5, 300);
        canvas.width = width;
        canvas.height = height;
    }
}

let gameInterval;
let seconds = 0;

function restartGame() {
    clearInterval(gameInterval);
    seconds = 0;
    startTimer();
    console.log("Game restarted.");
    // Aquí se implementaría la lógica para pausar el juego.
}

function quitGame() {
    const timerDisplay = document.getElementById("game-timer");
    clearInterval(gameInterval);
    seconds = 0;
    timerDisplay.textContent = `00:00`;
    console.log("Game quit.");
    // Aquí se implementaría la lógica para salir del juego.
}

function startTimer() {
    const timerDisplay = document.getElementById("game-timer");
    gameInterval = setInterval(() => {
        seconds++;
        let minutes = Math.floor(seconds / 60);
        let remainingSeconds = seconds % 60;
        timerDisplay.textContent = `${pad(minutes)}:${pad(remainingSeconds)}`;
    }, 1000);
}

function pad(number) {
    return number < 10 ? '0' + number : number;
}

function attachGameControlEventListeners() {
    const restartBtn = document.getElementById('restart-game');
    const quitBtn = document.getElementById('quit-game');
    restartBtn.addEventListener('click', restartGame);
    quitBtn.addEventListener('click', quitGame);
}

export default initPlayPage;