/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   play.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jutrera- <jutrera-@student.42madrid.com    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 11:49:24 by adpachec          #+#    #+#             */
/*   Updated: 2024/05/26 18:39:39 by jutrera-         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { isLoggedIn, getUsernameFromToken } from "./auth.js";
//import router from "./main.js";

let isPaused = true;
let seconds = 0;
let opponent;
let username = "jose";  //para quitar el login en pruebas
let mode = "";
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
	mode = m;

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
	if (mode == 'solo'){
		opponent = "AI";
	}else if (mode == 'local'){
		opponent = "Human";
	}else if (mode == 'remote'){
		opponent = "Remote";
	}
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
	if (mode == 'remote'){
		startRemote();
	}else{
		startLocal();
	}
	startPong(mode);
    attachGameControlEventListeners();
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
		stateMatch.state = 'playing';
		sendState('playing'); //enviar al servidor que se sigue jugando
	}
}

function quitGame() {
    sendState('pause'); //enviar al servidor que se ha pausado el juego
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
				sendState('quit'); //enviar al servidor que se ha salido del juego
				initPlayPage();
			}else if (result.isDenied){
				stateMatch.state = 'playing';
				isPaused = false;
				sendState('playing'); //enviar al servidor que se sigue jugando
			}});

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

let socket;

async function startLocal() {
	socket = new WebSocket("ws://localhost:8000/ws/game/"+ username + "/");
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
				socket = new WebSocket("ws://localhost:8000/ws/game/"+ randomId + "/" + username);
				Swal.fire({
					icon: "success",
					title: "Match created with code: " + randomId,
				});
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
				socket = new WebSocket("ws://localhost:8000/ws/game/"+ randomId + "/");
				Swal.fire({
					icon: "success",
					title: "Match joined",
				});
			} else{
				console.error("Match no encontrado: ", response.status);
				Swal.fire({
					icon: "error",
					title: "Match not found",
				});
			}
		} catch(error) {
			console.error("Error al comprobar id remoto:", error);
			return false;
		}

	} else {
		console.log("No se ha seleccionado ninguna opción");
	}
}

let stateMatch = {
	'ball': {
		'x': 0,
		'y': 0,
		'vx': 0,
		'vy': 0,
	},
	'player1': {
		'x': 10,
		'y': 0,
		'score': 0,
		'name': 'Player 1',
	},
	'player2': {
		'x': 0,
		'y': 0,
		'score': 0,
		'name': 'Player 2',
	},
	'state': 'waiting',
	'mode': '',
}

let v = 10;
let ballWidth = 10;
let ballHeight = 10;
let playerWidth = 15;
let playerHeight = 80;
let finalScore = 1;

function startPong(mode){
	document.addEventListener('keydown', handleKeyDown);
	console.log('Game initialized');
	let words = document.getElementById('game-score').textContent.split(' ');

	stateMatch = {
		'ball': {
			'x': canvas.width / 2 - 5,
			'y': canvas.height / 2 - 5,
			'vx': Math.floor(Math.random() * 7) - 3,
			'vy': Math.floor(Math.random() * 7) - 3,
		},
		'player1': {
			'x': 10,
			'y': canvas.height / 2 - 40,
			'score': 0,
			'name': words[0],
		},
		'player2': {
			'x': canvas.width - 25,
			'y': canvas.height / 2 - 40,
			'score': 0,
			'name': words[4],
		},
		'state': 'waiting',
		'mode': mode,
	}

	drawElements();
	sendState('start');  //enviar al servidor que se ha iniciado el juego
	stateMatch.state = 'playing';
	isPaused = false;
	sendState('playing'); //enviar al servidor que se esta jugando
	loop();
}

function loop() {
	if (stateMatch.state == 'gameover' || stateMatch.state == 'quit'){
		return;
	}
	updateGame();
	drawElements();
	requestAnimationFrame(loop);
}

async function sendState(msg){
	if (socket.readyState === WebSocket.OPEN){
		socket.send(JSON.stringify({
			"event": msg,
			"match": stateMatch,
		}));
	}
}

async function handleKeyDown(e) {
    const key = e.key;
	if (socket.readyState === WebSocket.OPEN && 
		key == 'ArrowUp' && key == 'ArrowDown' &&
		key == 'w' && key == 's'){
			socket.send(JSON.stringify({
				"event": 'move',
				"key": key,
				"stateMatch": stateMatch,
		}));
	}
}

function drawPaddles(){
	ctx.fillRect(stateMatch.player1.x, stateMatch.player1.y, playerWidth, playerHeight);
	ctx.fillRect(stateMatch.player2.x, stateMatch.player2.y, playerWidth, playerHeight);
}

function drawBall(){
	ctx.fillRect(stateMatch.ball.x, stateMatch.ball.y, ballWidth, ballHeight);
}

function drawNet(){
	ctx.fillRect(canvas.width / 2 - 1, 0, 2, canvas.height);
}

function drawScores(){
	document.getElementById('game-score').innerHTML = 
		`${stateMatch.player1.name} ${stateMatch.player1.score} -
		 ${stateMatch.player2.score} ${stateMatch.player2.name}`;
}

function drawElements() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall(); 
	drawNet();
	drawPaddles();
	drawScores();
}

function gameOver(){
	console.log('Game Over');
	isPaused = true;
	stateMatch.state = 'gameover';
	sendState('gameover'); //enviar al servidor que se ha acabado el juego
	let texto;
	if (stateMatch.player1.score == finalScore)
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
					startPong(mode);
				}else if (result.isDenied){
					initPlayPage();
				}});
		};
	});
}

async function updateGame(){
	
	socket.onopen = e => {
		console.log(e);
	}

	socket.onmessage = e => {
		console.log(e);
		const data = JSON.parse(e.data);

		if(data.event == "show_error"){
			Swal.fire({
				icon: "error",
				title: data.error,
			}).then(e => window.location.href = "/");
		}

		else if(data.event == "write_names"){
			if (stateMatch.player1.name == "" || stateMatch.player1.name == "Waiting...") 
				stateMatch.player1.name = data.name1;
			if (stateMatch.player2.name == "" || stateMatch.player2.name == "Waiting...")
				stateMatch.player2.name = data.name2;
			stateMatch.ball.vy = data.ballvy;
			drawScores();
		}

		else if(data.event == "game_start"){
			player = data.player;
			if (player == "1"){
				stateMatch.player1.name = playerName;
				socket.send(JSON.stringify({
					"event": 'write_names',
					"name1": playerName,
					"name2": "Waiting...",
					"ballvy" : 0,
				}));
			}else{
				stateMatch.player2.name = playerName;
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
	
		else if(data.event == "game_update"){
			stateMatch = data.stateMatch;
			drawElements();
		}
	
		else if(data.event == "opponent_left" && stateMatch.state != 'ended'){
			stateMatch.state = 'ended';
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
			stateMatch.state = 'ended';
			drawElements();
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