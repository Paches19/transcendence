/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   play.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jutrera- <jutrera-@student.42madrid.com    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 11:49:24 by adpachec          #+#    #+#             */
/*   Updated: 2024/06/03 00:14:24 by jutrera-         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { isLoggedIn, getUsernameFromToken } from "./auth.js";
//import router from "./main.js";

let modality = "";
let ctx;
let canvas;

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
	console.log("play mode = " + m);
	modality = m;

	// Quitar comentarios para que pida login, de momento es para pruebas

	showGameScreen();
	//if (isLoggedIn()) {
		if (modality == 'remote'){
			startPongRemote();
		}else{
			startPongLocal();
			startTimer();
		}
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

function showGameScreen() {
	let opponent
	if (modality == 'solo'){
		opponent = "AI";
	}else if (modality == 'remote'){
		opponent = "(Waiting...)";
	}else
		opponent = "Human";
		
    const mainContent = document.getElementById('main-content');
   // const username = getUsernameFromToken();
   	const username = "jose" //para pruebas
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
	attachGameControlEventListeners();
}

function initializeGame() {
    canvas = document.getElementById("pong-game");
    if (canvas) {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
		resetTime();
    }
}

function resizeCanvas() {
    const container = document.querySelector('.game-container');
    if (canvas && container) {
        const width = container.clientWidth;
        const height = Math.max(width * 0.5, 300);
        canvas.width = width;
        canvas.height = height;
    }
}

let gameInterval;
let isPaused = true;
let seconds = 0;

function startTimer() {
    const timerDisplay = document.getElementById("game-timer");
	
	function pad(number) {return number < 10 ? '0' + number : number;}
	
    gameInterval = setInterval(() => {
		if (!isPaused){
	        seconds++;
    	    let minutes = Math.floor(seconds / 60);
    	    let remainingSeconds = seconds % 60;
    	    timerDisplay.textContent = `${pad(minutes)}:${pad(remainingSeconds)}`;
		}
	}, 1000);
}

function resetTime(){
	const timerDisplay = document.getElementById("game-timer");
	clearInterval(gameInterval);
	seconds = 0;
	timerDisplay.textContent = `00:00`;
	isPaused = false;
}

function attachGameControlEventListeners() {
   	document.getElementById('pause-game').addEventListener('click', pauseGame);
    document.getElementById('quit-game').addEventListener('click', quitGame);
	document.addEventListener('keydown', handleKeyDown);
}

export default initPlayPage;
export {initPlayPage, resetTime};

let speed = 10; //para mover las palas (desplazamiento vertical)
let stateMatch;

function handleKeyDown(e) {
    const key = e.key;
	
	if (key == 'ArrowUp' || key == 'ArrowDown' ||
	(stateMatch.modality == "local" && (key == "w" || key == "W")) ||
	(stateMatch.modality == "local" && (key == "s" || key == "S"))){
		sendKey(key);	
	}

}

function pauseGame() {
	let textButton = document.getElementById("pause-game");
	if (textButton.textContent == "Pause"){
		textButton.textContent = "Resume";
		isPaused = true;
		sendState('pause'); //enviar al servidor que se ha pausado el juego
	}
	else{
		textButton.textContent = "Pause";
		isPaused = false;
		sendState('playing'); //enviar al servidor que se sigue jugando
	}
}

function quitGame() {
    isPaused = true;
	sendState('pause'); //enviar al servidor que se ha pausado el juego
	Swal.fire({
		confirmButtonColor: '#32B974',
		title: "Are you sure ?",
		showDenyButton: true,
		showCancelButton: false,
		confirmButtonText: "Yes",
		denyButtonText: `No`
	  }).then((result) => {
			if (result.isConfirmed) {
				sendState('quit'); //enviar al servidor que se ha salido del juego
				initPlayPage();
				return;
			}else if (result.isDenied){
				isPaused = false;
				sendState('playing'); //enviar al servidor que se sigue jugando
			}});

}

function serializeStateMatch() {
    return JSON.stringify({
        id: stateMatch.id,
        v: stateMatch.v || speed,
        key: stateMatch.key || '',
        ballWidth: stateMatch.ballWidth || 10,
        ballHeight: stateMatch.ballHeight || 10,
        playerWidth: stateMatch.playerWidth || 15,
        playerHeight: stateMatch.playerHeight || 80,
        finalScore: stateMatch.finalScore || 3,
        x1: stateMatch.x1 || 0,
        y1: stateMatch.y1 || 0,
        score1: stateMatch.score1 || 0,
        name1: stateMatch.name1 || 'Player1',
        x2: stateMatch.x2 || 0,
        y2: stateMatch.y2 || 0,
        score2: stateMatch.score2 || 0,
        name2: stateMatch.name2 || 'Player2',
        ballX: stateMatch.ballX || 0,
        ballY: stateMatch.ballY || 0,
        ballSpeedX: stateMatch.ballSpeedX || 0,
        ballSpeedY: stateMatch.ballSpeedY || 0,
        boundX: stateMatch.boundX || 0,
        boundY: stateMatch.boundY || 0,
        state: stateMatch.state || 'waiting',
        modality: stateMatch.modality || ''
    });
}

async function sendKey(keypressed){
	stateMatch.key = keypressed;
	try {
		const response = await fetch('http://localhost:8000/api/key_press', {
			method: 'POST',
			headers: {'Content-Type': 'application/json',},
			body:JSON.stringify({key : keypressed}),
		});
		if (!response.ok) {
			throw new Error('Failed to move paddles');
		}
		else{
			console.log("Key sent: ", key);
		}
	} catch (error) {
		console.error('Error moving paddles:', error);
	}
}

async function sendState(msg){
	stateMatch.state = msg
	try {
		const response = await fetch('http://localhost:8000/api/state_game', {
			method: 'POST',
			headers: {'Content-Type': 'application/json',},
			body: JSON.stringify({ match: stateMatch }),
		});
		if (!response.ok) {
			throw new Error('Failed to start game');
		}
		else{
			console.log("State sent: ", msg);
		}
	} catch (error) {
		console.error('Error starting game:', error);
	}
}

async function sendStart(){
	console.log("1. Sending start game");

	try {
		const response = await fetch('http://localhost:8000/api/start_game', {
			method: 'POST',
			headers: {'Content-Type': 'application/json',},
			body: serializeStateMatch(),
		});
		if (!response.ok) {
			throw new Error('Failed to start game');
		}
		else{
			console.log("2. State sent ");
		}
	} catch (error) {
		console.error('Error starting game:', error);
	}
}

async function startPongRemote() {
	//Preguntamos si queremos crear o unirnos a una partida
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
		var randomId = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
		try {
			const apiUrl = 'http://localhost:8000/api/new_match';
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: {'Content-Type': 'application/json',},
				body: JSON.stringify({id: randomId,}),
			});
			const data = await response.json();
			if (response.ok && data.msg == "Match created"){
				Swal.fire({
					icon: "success",
					title: "New match code: " + randomId,
				});
			}else {
				Swal.fire({
					icon: "error",
					title: response.status + "Match already exist ",				});
			}
		} catch(error) {
			console.error("Fetch error: ", error);
			return false;
		}
	
	} else if (mode == "join") {
		const { value: matchId } = await Swal.fire({
			title: "Enter match code",
			input: "text",
			inputPlaceholder: "Match code",
			inputValidator: (value) => {
				if (!value) {
					return "Please, write a code!";
				}
			}
		});
		
		try{
			const apiUrl = 'http://localhost:8000/api/join_match';
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: {'Content-Type': 'application/json',},
				body: JSON.stringify({id: matchId,}),
			});
	
			const data = await response.json();
		
			if (response.ok && data.msg === "Match joined") {
				Swal.fire("Joined !");
			} else{
				Swal.fire({
					icon: "error",
					title: "Match not found" + response.status,
				});
			}
		} catch(error) {
			console.error("fetch request error: ", error);
			return false;
		}
	}
}

function startPongLocal(){
	console.log('game initialized');

	ctx.fillStyle = '#FFF';
	let words = document.getElementById('game-score').textContent.split(' ');
	let vx = Math.floor(Math.random() * 10) + 5;
	let vy = Math.floor(Math.random() * 7) + 5;
	let signo = Math.floor(Math.random() * 2);
	if (signo == 0) vx = -vx;
	signo = Math.floor(Math.random() * 2);
	if (signo == 0) vy = -vy;
	
	stateMatch = {
		'id' : 0,
		'v': speed,
		'key' : '',
		'ballWidth': 10,
		'ballHeight': 10,
		'playerWidth': 15,
		'playerHeight': 80,
		'finalScore': 3,
		
		'x1': 10,
		'y1': canvas.height / 2 - 40,
		'score1': 0,
		'name1': words[0],
		
		'x2': canvas.width - 25,
		'y2': canvas.height / 2 - 40,
		'score2': 0,
		'name2': words[4],
				
		'ballX': canvas.width / 2 - 5,
		'ballY': canvas.height / 2 - 5,
		'ballSpeedX': vx,
		'ballSpeedY': vy,
	
		'boundX': canvas.width,
		'boundY': canvas.height,

		'state': 'waiting',
		'modality': modality,
	}
	drawElements();
	sendStart();
	isPaused = false;
	sendState('playing');
	while (stateMatch.state != 'gameover' && stateMatch.state != 'quit'){
		if (stateMatch.state == 'playing'){
			updateStateMatch();
			drawElements();
		}
	}
	if (stateMatch.state == 'gameover'){
		gameOver();
	}
}

function drawElements() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);// Limpia el canvas
    ctx.fillRect(stateMatch.ballX, stateMatch.ballY, stateMatch.ballWidth, stateMatch.ballHeight);// Dibuja la bola
    ctx.fillRect(canvas.width / 2 - 1, 0, 2, canvas.height);// Dibuja la red
    ctx.fillRect(stateMatch.x1, stateMatch.y1, stateMatch.playerWidth, stateMatch.playerHeight);// Dibuja la pala izuierda
    ctx.fillRect(stateMatch.x2, stateMatch.y2, stateMatch.playerWidth, stateMatch.playerHeight);// Dibuja la pala derecha
    document.getElementById('game-score').innerHTML = 
		`${stateMatch.name1} ${stateMatch.score1} - ${stateMatch.score2} ${stateMatch.name2}`;// Actualiza la puntuación
}

function gameOver(){
	console.log('Game Over');
	isPaused = true;
	let texto;
	if (stateMatch.score1 == stateMatch.finalScore)
		texto = stateMatch.name1;
	else 
		texto = stateMatch.name2;

	Swal.fire({
		title: texto + " WIN",
		confirmButtonColor: '#32B974',
	}).then((result) => {	
		if (result.isConfirmed){
			Swal.fire({
				confirmButtonColor: '#32B974',
				title: "Play again ?",
				showDenyButton: true,
				showCancelButton: false,
				confirmButtonText: "Yes",
				denyButtonText: `No`
			  }).then((result) => {
				if (result.isConfirmed) {
					resetTime();
					startLocalPong();
				}else if (result.isDenied){
					initPlayPage();
					return;
				}});
		};
	});
}

async function updateStateMatch() {
	const apiUrl = 'http://localhost:8000/api/update_game';
	try{
		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {'Content-Type': 'application/json',},
		});
	if (!response.ok) {
		throw new Error('Failed to update game');
	}
	const newState = await response.json();
	} catch (error) {
		console.error('Error updating game:', error);
	}
	
	stateMatch.x1 = newState.x1;
	stateMatch.y1 = newState.y1;
	stateMatch.score1 = newState.score1;
	stateMatch.x2 = newState.x2;
	stateMatch.y2 = newState.y2;
	stateMatch.score2 = newState.score2;
	stateMatch.ballX = newState.ballX;
	stateMatch.ballY = newState.ballY;
	stateMatch.ballSpeedX = newState.ballSpeedX;
	stateMatch.ballSpeedY = newState.ballSpeedY;
	stateMatch.state = newState.state;
}