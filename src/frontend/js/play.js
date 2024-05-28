/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   play.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jutrera- <jutrera-@student.42madrid.com    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 11:49:24 by adpachec          #+#    #+#             */
/*   Updated: 2024/05/28 19:07:56 by jutrera-         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { isLoggedIn, getUsernameFromToken } from "./auth.js";
//import router from "./main.js";

let isPaused = true;
let seconds = 0;
let opponent;
let username = "jose";  //para quitar el login en pruebas
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
	console.log("mode = " + m);
	modality = m;

	// Quitar comentarios para que pida login, de momento es para pruebas
	
	//if (isLoggedIn()) {
		showGameScreen();
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
	if (modality == 'solo'){
		opponent = "AI";
	}else if (modality == 'remote'){
		opponent = "Remote";
	}else
		opponent = "Human";
		
    const mainContent = document.getElementById('main-content');
   // const username = getUsernameFromToken();
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
	if (modality == 'remote'){
		startRemote();
	}else{
		startLocal();
	}
	startPong();
}

function initializeGame() {
    canvas = document.getElementById("pong-game");
    if (canvas) {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
		resetTime();
        startTimer();
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

function resetTime(){
	const timerDisplay = document.getElementById("game-timer");
	clearInterval(gameInterval);
	seconds = 0;
	timerDisplay.textContent = `00:00`;
	isPaused = false;
}

let stateMatch = {
	'id': 0,
		
	'x1': 10,
	'y1': 0,
	'score1': 0,
	'name1': 'Player 1',

	'x2': 0,
	'y2': 0,
	'score2': 0,
	'name2': 'Player 2',

	'ballx': 0,
	'bally': 0,
	'ballvx': 0,
	'ballvy': 0,
	
	'state': 'waiting',
	'modality': '',
}

function pauseGame() {
	let textButton = document.getElementById("pause-game");
	if (textButton.textContent == "Pause"){
		textButton.textContent = "Resume";
		isPaused = true;
		stateMatch.state = 'pause';
		sendState(); //enviar al servidor que se ha pausado el juego
	}
	else{
		textButton.textContent = "Pause";
		isPaused = false;
		stateMatch.state = 'playing';
		sendState(); //enviar al servidor que se sigue jugando
	}
}

function quitGame() {
	stateMatch.state = 'pause';
    sendState(); //enviar al servidor que se ha pausado el juego
	isPaused = true;
	Swal.fire({
		confirmButtonColor: '#32B974',
		title: "Are you sure ?",
		showDenyButton: true,
		showCancelButton: false,
		confirmButtonText: "Yes",
		denyButtonText: `No`
	  }).then((result) => {
			if (result.isConfirmed) {
				stateMatch.state = 'quit';
				sendState(); //enviar al servidor que se ha salido del juego
				initPlayPage();
			}else if (result.isDenied){
				stateMatch.state = 'playing';
				isPaused = false;
				sendState(); //enviar al servidor que se sigue jugando
			}});

}

function handleKeyDown(e) {
	console.log("Key pressed: ", e.key);
    const key = e.key;
	
	if (key == 'ArrowUp'){
		stateMatch.state = "up1";
		sendState();
	}else if (key == "w" || key == "W"){
		stateMatch.state = "up2";
		sendState();
	}else if (key == 'ArrowDown'){
		stateMatch.state = "down1";
		sendState();
	}else if (key == 's' || key == 'S'){
		stateMatch.state = "down2",
		sendState();
	};
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
   	document.getElementById('pause-game').addEventListener('click', pauseGame);
    document.getElementById('quit-game').addEventListener('click', quitGame);
	document.getElementById('pong-game').addEventListener("keydown", handleKeyDown);
}

export default initPlayPage;
export {initPlayPage, resetTime};

let socket;

async function sendState(){
	while (socket.readyState !== WebSocket.OPEN) {
		await new Promise(resolve => setTimeout(resolve, 100));  // Esperar 100ms antes de volver a comprobar
	}
	socket.send(JSON.stringify({
		"event": "game_state",
		"match": stateMatch,
	}));
	console.log("State sent");
}

async function startLocal() {
	socket = new WebSocket("ws://localhost:8000/ws/game/"+ username + "/");
	while (socket.readyState != WebSocket.OPEN){
		await new Promise(resolve => setTimeout(resolve, 1000));
		console.log("Connecting...");
	}
	console.log("Connected");
}

async function startRemote() {
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
			const apiUrl = 'http://localhost:8000/api/newmatch';
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
				socket = new WebSocket("ws://localhost:8000/ws/game/"+ randomId + "/");
				Swal.fire({
					icon: "success",
					title: "Match created with code: " + randomId,
				});
			}else {
				console.error("Error al guardar el id remoto: ", response.status);
			}
		} catch(error) {
			console.error("Error en la solicitud fetch:", error);
			return false;
		}
	
	} else if (mode == "join") {
		const { value: matchId } = await Swal.fire({
			title: "Enter match code",
			input: "text",
			inputPlaceholder: "Match code",
			inputValidator: (value) => {
				if (!value) {
					return "You need to write something!";
				}
			}
		});
		
		try{
			const apiUrl = 'http://localhost:8000/api/joinmatch';
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
				socket = new WebSocket("ws://localhost:8000/ws/game/"+ randomId + "/");
				Swal.fire({
					icon: "success",
					title: "Joining to match code: " + code,
				});
			} else{
				console.error("Match no encontrado: ", response.status);
				Swal.fire({
					icon: "error",
					title: "Match not found",
				});
			}
		} catch(error) {
			console.error("Error en la solicitud fetch: ", error);
			return false;
		}

	} else {
		console.log("No se ha seleccionado ninguna opción");
	}
}

let v = 10;
let ballWidth = 10;
let ballHeight = 10;
let playerWidth = 15;
let playerHeight = 80;
let finalScore = 3;

function startPong(){
	console.log('Game initialized');
	let words = document.getElementById('game-score').textContent.split(' ');

	stateMatch = {
		'id' : 0,
		
		'x1': 10,
		'y1': canvas.height / 2 - 40,
		'score1': 0,
		'name1': words[0],
		
		'x2': canvas.width - 25,
		'y2': canvas.height / 2 - 40,
		'score2': 0,
		'name2': words[4],
				
		'ballx': canvas.width / 2 - 5,
		'bally': canvas.height / 2 - 5,
		'ballvx': Math.floor(Math.random() * 7) - 3,
		'ballvy': Math.floor(Math.random() * 7) - 3,
	
		'state': 'waiting',
		'modality': modality,
	}

	drawElements();
	stateMatch.state = 'start';
	sendState();  //enviar al servidor que se ha iniciado el juego
	// Aquí esperamos un breve momento antes de cambiar el estado a 'playing'
	setTimeout(() => {
		stateMatch.state = 'playing';
		sendState(); // Enviar al servidor que se está jugando
		isPaused = false;
	}, 100); // Espera 100ms antes de cambiar a 'playing'
	loop();
}

function loop() {
	if (stateMatch.state == 'gameover' || stateMatch.state == 'quit'){
		return;
	}
	drawElements();
	requestAnimationFrame(loop);
}


function drawElements() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	//draw ball
	ctx.fillRect(stateMatch.ballx, stateMatch.bally, ballWidth, ballHeight);
	//draw net
	ctx.fillRect(canvas.width / 2 - 1, 0, 2, canvas.height);
	//draw paddles
	ctx.fillRect(stateMatch.x1, stateMatch.y1, playerWidth, playerHeight);
	ctx.fillRect(stateMatch.x2, stateMatch.y2, playerWidth, playerHeight);
	//draw scores
	document.getElementById('game-score').innerHTML = 
		`${stateMatch.name1} ${stateMatch.score1} -
		 ${stateMatch.score2} ${stateMatch.name2}`;
}

function gameOver(){
	console.log('Game Over');
	isPaused = true;
	stateMatch.state = 'gameover';
	let texto;
	if (stateMatch.score1 == finalScore)
		texto = "YOU WIN";
	else
		texto = "YOU LOSE";

	Swal.fire({
		title: texto,
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
					startPong();
				}else if (result.isDenied){
					initPlayPage();
				}});
		};
	});
}
	
if (socket){
	socket.onopen = e => {
		console.log("Connection established");
	}

	socket.onclose = e => {
		if (e.wasClean){
			alert(`[close] Conexión cerrada limpiamente, código=${e.code} motivo=${e.reason}`);
	  	} else {
	    	// ej. El proceso del servidor se detuvo o la red está caída
	    	// event.code es usualmente 1006 en este caso
	    	alert('[close] La conexión se cayó');
  		}
	}

	socket.onerror = e => {
		alert(`[error] ${e.message}`);
	}
	
	socket.onmessage = e => {
		const data = JSON.parse(e.data);

		console.log("Event received: ", data.event);
		if (data.event == "show_error"){
			Swal.fire({
				icon: "error",
				title: data.error,
			}).then(e => window.location.href = "/");
		}
		else if(data.event == "write_names"){
			if (stateMatch.name1 == "" || stateMatch.name1 == "Waiting...") 
				stateMatch.name1 = data.name1;
			if (stateMatch.name2 == "" || stateMatch.name2 == "Waiting...")
				stateMatch.name2 = data.name2;
			stateMatch.ballvy = data.ballvy;
		}

		else if(data.event == "game_start"){
			player = data.player;
			if (player == "1"){
				stateMatch.name1 = playerName;
				socket.send(JSON.stringify({
				"event": 'write_names',
					"name1": playerName,
					"name2": "Waiting...",
					"ballvy" : 0,
				}));
			}else{
				stateMatch.name2 = playerName;
				socket.send(JSON.stringify({
					"event": 'write_names',
					"name1": "",
					"name2": playerName,
					"ballvy" : Math.floor(Math.random() * 7) - 3,
				}));
			}
			drawElements();
			loop();
			setTimeout(waitMatch,3000);
		}
	
		else if(data.event == "game_state"){
			stateMatch = data.stateMatch;
			drawElements();
		}

		else if(data.event == "opponent_left" && stateMatch.state != 'quit'){
			stateMatch.state = 'quit';
			drawElements();
			setTimeout(() => {
				Swal.fire({
					icon:  "info",
					title:  "Opponent Left",
					confirmButtonText: "Ok",
				}).then(e => window.location.href = "/")
			}, 400);
		}
	
		else if (data.event == "game_over"){
			winner = data.winner;
			gameOver();
			Swal.fire({
				icon: winner == currentName ?'success': "error",
				title: winner == currentName ? "You win!" : "You lose!",
				confirmButtonText: "Ok",
			}).then((result) => { if (result.isConfirmed) {
					window.location.href = "/";
			}});
		}
	}
}