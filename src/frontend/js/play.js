/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   play.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jutrera- <jutrera-@student.42madrid.com    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 11:49:24 by adpachec          #+#    #+#             */
/*   Updated: 2024/05/21 23:53:59 by jutrera-         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { isLoggedIn, getUsernameFromToken } from "./auth.js";
import router from "./main.js";
import { startPong, quitPong, pausePong, playPong } from "./pong.js";

let isPaused = true;
let seconds = 0;
let opponent;
let username = "jose";
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
            <button id="solo-vs-ai" class="btn btn-primary game-option-button">Solo vs AI</button>
            <button id="local-vs-human" class="btn btn-light game-option-button">Local vs Human</button>
            <button id="remote-vs-human" class="btn btn-success game-option-button">Remote vs Human</button>
            <button id="join-tournament" class="btn btn-info game-option-button">Tournament Game</button>
        </div>
    </div>
    `;
}

function startGame(m) {
	console.log("mode = " + m);

	//if (isLoggedIn()) {
		showGameScreen(m);
	//}  else {
      //  router.route("/login");
   // }
}

function attachEventListeners() {
    document.getElementById('solo-vs-ai').addEventListener('click', () => startGame('solo'));
    document.getElementById('local-vs-human').addEventListener('click', () => startGame('local'));
    document.getElementById('remote-vs-human').addEventListener('click', () => startGame('remote'));
    document.getElementById('join-tournament').addEventListener('click', () => startGame('tournament'));
}

function showGameScreen(m) {
	if (m == 'solo'){
		opponent = "AI";
	}else if (m == 'local'){
		opponent = "Human";
	}else if (m == 'remote'){
		opponent = "Remote";
	}
    const mainContent = document.getElementById('main-content');
    const username = getUsernameFromToken();
    mainContent.innerHTML = `
    <div class="container mt-5 game-container">
        <div class="row align-items-center">
            <div class="col-12 col-lg-8 mx-auto">
                <div class="bg-dark text-white p-3 rounded-3">
                    <div class="d-flex justify-content-between mb-2">
                        <h2 id="game-score" class="mb-0">${username} 0 - 0 ${opponent}</h2>
                        <h3 id="game-timer" class="mb-0">00:00</h3>
                    </div>
                    <canvas id="pong-game" class="w-100"></canvas>
                </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12 text-center">
                <button class="btn btn-success btn-lg mx-2" id="pause-game">Pause</button>
                <button class="btn btn-danger btn-lg mx-2" id="quit-game">Quit</button>
            </div>
        </div>
    </div>
    `;
    initializeGame();
	startPong(m);
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
		resetTime();
        startTimer();
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

function resetTime(){
	const timerDisplay = document.getElementById("game-timer");
	clearInterval(gameInterval);
	seconds = 0;
	timerDisplay.textContent = `00:00`;
	isPaused = false;
}

function pauseGame() {
	let textButton = document.getElementById("pause-game");
	if (textButton.textContent == "Pause"){
		textButton.textContent = "Resume";
		isPaused = true;
		pausePong();
	}
	else{
		textButton.textContent = "Pause";
		isPaused = false;
		playPong();
	}
}

function quitGame() {
    resetTime();
    console.log("Game quit.");
    // Aquí se implementaría la lógica para salir del juego.
	quitPong();
	initPlayPage();
}

function startTimer() {
    const timerDisplay = document.getElementById("game-timer");
    gameInterval = setInterval(() => {
		if (!isPaused){
	        seconds++;
    	    let minutes = Math.floor(seconds / 60);
    	    let remainingSeconds = seconds % 60;
    	    timerDisplay.textContent = `${pad(minutes)}:${pad(remainingSeconds)}`;
		}
	}, 1000);
}

function pad(number) {
    return number < 10 ? '0' + number : number;
}

function attachGameControlEventListeners() {
    const restartBtn = document.getElementById('pause-game');
    const quitBtn = document.getElementById('quit-game');
    restartBtn.addEventListener('click', pauseGame);
    quitBtn.addEventListener('click', quitGame);
}

export default initPlayPage;
export {initPlayPage, resetTime};


async function startRemoteVsHuman() {
	// if (isLoggedIn()) {
	// 	console.log("Starting game: Remote vs Human");
	// 	showGameRemoteScreen();
	// } else {
	// 	router.route("/login");
	// }
	//showGameRemoteScreen()
	let username = "jose";
	const inputOptions = new Promise((resolve) => {
		setTimeout(() => {
		  resolve({
			"new": "New",
			"join": "Join",
		  });
		}, 1000);
	  });
	  
	  const { value: mode } = await Swal.fire({
		title: "Select mode",
		input: "radio",
		inputOptions,
		inputValidator: (value) => {
		  if (!value) {
			return "You need to choose something!";
		  }
		}
	  });
	  
	  if (mode == "new") {
		const apiUrl = 'http://localhost:8000/api/newmatch';
		var randomId = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
		
		try {
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: randomId,
				}),
			});
	
			const data = await response.json();
			
			if (response.ok && data.msg == "Match created"){
				window.location.href = 'http://localhost:8000/game/' + randomId + '/' + username;
			}else {
				console.error("Error al guardar el id remoto: ", response.status);
			}
		} catch(error) {
			console.error("Error al guardar el id remoto:", error);
			return false;
		}
	
	} else if (mode == "join") {
		const apiUrl = 'http://localhost:8000/api/joinmatch';
		
		const { value: matchId } = await Swal.fire({
			title: "Enter the match id",
			input: "text",
			inputPlaceholder: "Match id",
			inputValidator: (value) => {
				if (!value) {
					return "You need to write something!";
				}
			}
		});
		
		try{
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: matchId,
				}),
			});
	
			const data = await response.json();
		
			if (response.ok && data.msg === "Match joined") {
				window.location.href = 'http://localhost:8000/game/' + matchId + '/' + username;
			} else{
				console.error("Error al comprobar id remoto: ", response.status);
			}
		} catch(error) {
			console.error("Error al comprobar id remoto:", error);
			return false;
		}

	} else {
		console.log("No se ha seleccionado ninguna opción");
	}
}