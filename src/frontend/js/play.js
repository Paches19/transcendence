/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   play.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jutrera- <jutrera-@student.42madrid.com    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 11:49:24 by adpachec          #+#    #+#             */
/*   Updated: 2024/06/10 20:26:20 by jutrera-         ###   ########.fr       */
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

let name1, name2;
function showGameScreen() {

	if (modality == 'solo'){
		name2 = "AI";
	}else if (modality == 'remote'){
		name2 = "(Waiting...)";
	}else
		name2 = "Human";
	name1 = "jose" //para pruebas	

	const mainContent = document.getElementById('main-content');
   // const name1 = getUsernameFromToken();   
    mainContent.innerHTML = `
    <div class="container mt-5 game-container">
        <div class="row align-items-center">
            <div class="col-12 col-lg-8 mx-auto">
                <div class="bg-dark text-white p-3 rounded-3">
                    <div class="d-flex justify-content-between mb-2">
                        <h2 id="game-score" class="mb-0">${name1} 0 - 0 ${name2}</h2>
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
		ctx = canvas.getContext('2d');
		ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
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
	console.log("attachGameControlEventListeners");
   	document.getElementById('pause-game').addEventListener('click', pauseGame);
    document.getElementById('quit-game').addEventListener('click', quitGame);
	document.addEventListener('keydown', handleKeyDown);
}

export default initPlayPage;
export {initPlayPage, resetTime};

let statePaddles = { x1: 0, y1: 0, score1: 0, x2: 0, y2: 0, score2: 0 };
let stateBall = { x: 0, y: 0, vx: 0, vy: 0 };
let stateGame = { id: 0, v: 0, ballWidth: 0, ballHeight: 0, playerWidth: 0, playerHeight: 0, finalScore: 0, name1: '', name2: '', boundX: 0, boundY: 0 };
const levelAI = Math.floor(Math.random() * 3); //Determina el nivel de anticipación de la IA
let animationInterval;
let aiInterval;
let refreshTime = 1000/60;

async function handleKeyDown(e) {
    const pressed = e.key;
	if (pressed == 'ArrowUp' || pressed == 'ArrowDown' ||
		(modality == "local" && (pressed == "w" || pressed == "W")) ||
		(modality == "local" && (pressed == "s" || pressed == "S")) ||
		(modality == "solo" && pressed == "A") ||
		(modality == "solo" && pressed == "D")){
			const apiUrl = 'http://localhost:8000/api/move_paddles';
			try {
				const response = await fetch(apiUrl, {
					method: 'POST',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({keypressed: pressed,}),
				});
				if (response.ok){
					const responsedata = await response.json();
					ctx.fillStyle = '#000';
					ctx.fillRect(statePaddles.x1, 0, stateGame.playerWidth, stateGame.boundY); //Borra la paleta 1
					ctx.fillRect(statePaddles.x2, 0, stateGame.playerWidth, stateGame.boundY); //Borra la paleta 2
	
					statePaddles = responsedata.paddles;
		
					ctx.fillStyle = '#FFF';
					ctx.fillRect(statePaddles.x1, statePaddles.y1, stateGame.playerWidth, stateGame.playerHeight); //Dibuja la paleta 1
					ctx.fillRect(statePaddles.x2, statePaddles.y2, stateGame.playerWidth, stateGame.playerHeight); //Dibuja la paleta 2
				}
			} catch (error) {
				console.error('Error moving paddles:', error);
			}
	}
}

function pauseGame() {
	console.log("isPaused");
	let textButton = document.getElementById("pause-game");
	if (textButton.textContent == "Pause"){
		textButton.textContent = "Resume";
		isPaused = true;
		console.log("pauseGame");
		checkFinish('pause'); //debe parar el movimiento de la bola
	}
	else{
		textButton.textContent = "Pause";
		animate(); //debe reanudar el movimiento de la bola
	}
}

function quitGame() {
    isPaused = true;
	checkFinish('pause');
	Swal.fire({
		confirmButtonColor: '#32B974',
		title: "Are you sure ?",
		showDenyButton: true,
		showCancelButton: false,
		confirmButtonText: "Yes",
		denyButtonText: `No`
	  }).then((result) => {
			if (result.isConfirmed) {
				initPlayPage();
				return;
			}else if (result.isDenied){
				textButton.textContent = "Pause";
				animate();
			}
		});
}

function playAI(){
	if (stateBall.vx > 0 && modality == "solo") {
		let xp;

    	// Ajustar el factor de anticipación basado en el nivel
    	switch (levelAI) {
    		case 0:
        	    xp = 0.25 * stateGame.boundX; // Poco anticipación
        	    break;
        	case 1:
        	    xp = 0.5  * stateGame.boundX; // Moderada anticipación
        	    break;
        	default:
        	    xp = 0.75 * stateGame.boundX; // Mucha anticipación
	   	 }

	    // Calcular la posición anticipada de la bola
	    const t = (xp - stateBall.x) / stateBall.vx;
		let yp = stateBall.y + t * stateBall.vy;
		while (yp < 0 || yp > stateGame.boundY) {
			if (yp < 0) {
				yp = -yp;
			} else {
				yp = 2 * stateGame.boundY - yp;
			}
		}
		const paddleCenter = statePaddles.y2 + stateGame.playerHeight / 2;

	    let event;

	    // Simular eventos de teclado para mover la pala
    	if (yp < paddleCenter) {
        	event = new KeyboardEvent('keydown', { key: 'A' });
			sleep(50);
			document.dispatchEvent(event);
    	} else if (yp > paddleCenter) {
        	event = new KeyboardEvent('keydown', { key: 'D' });
			sleep(50);
			document.dispatchEvent(event);
    	}
	}
}

async function initGame(id, name1, name2, boundX, boundY){
	const apiUrl = 'http://localhost:8000/api/init_game';
	try{
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {'Content-Type': 'application/json',},
			body: JSON.stringify( { id:id,
									name1: name1, 
									name2: name2, 
									boundX: boundX, 
									boundY: boundY}),
		});
		if (response.ok){
			const responsedata = await response.json();
			stateGame = responsedata.game
			stateBall = responsedata.ball
			statePaddles = responsedata.paddles
			ctx.fillStyle = '#FFF';
			ctx.fillRect(canvas.width / 2 - 1, 0, 2, canvas.height);// Dibuja la red
			ctx.fillRect(statePaddles.x1, statePaddles.y1, stateGame.playerWidth, stateGame.playerHeight); //Dibuja la paleta 1
			ctx.fillRect(statePaddles.x2, statePaddles.y2, stateGame.playerWidth, stateGame.playerHeight); //Dibuja la paleta 2
			ctx.fillRect(stateBall.x, stateBall.y, stateGame.ballWidth, stateGame.ballHeight);// Dibuja la bola
			console.log("Game initialized");
		}
	} catch (error) {
		console.error('Error initializing game:', error);
	}
}

async function resetBall(){
	const apiUrl = 'http://localhost:8000/api/reset_ball';
	try{
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {'Content-Type': 'application/json',},
		});
		if (response.ok){
			const responsedata = await response.json();
			ctx.fillStyle = '#000';
			ctx.fillRect(stateBall.x, stateBall.y, stateGame.ballWidth, stateGame.ballHeight); //Borra la bola
			stateBall = responsedata.ball; //Obtiene la nueva posición de la bola
			ctx.fillStyle = '#FFF';
			ctx.fillRect(canvas.width / 2 - 1, 0, 2, canvas.height);// Dibuja la red
			ctx.fillRect(stateBall.x, stateBall.y, stateGame.ballWidth, stateGame.ballHeight);// Dibuja la bola
		}
	} catch (error) {
		console.error('Error reseting ball:', error);
	}
}
			
function startPongLocal(){
	resetTime();
	let id = 0;
	initGame(id, name1, name2, canvas.width, canvas.height);
	startTimer();
	animate();
}

function drawScores(){
	document.getElementById('game-score').innerHTML =
		`${stateGame.name1} ${statePaddles.score1} - ${statePaddles.score2} ${stateGame.name2}`;// Actualiza la puntuación
}

async function moveBall() {
	const apiUrl = 'http://localhost:8000/api/move_ball';
	try{
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {'Content-Type': 'application/json',},
		});
		if (response.ok){
			const responsedata = await response.json();
			ctx.fillStyle = '#000';
			ctx.fillRect(stateBall.x, stateBall.y, stateGame.ballWidth, stateGame.ballHeight); //Borra la bola
			stateBall = responsedata.ball; //Obtiene la nueva posición de la bola
			ctx.fillStyle = '#FFF';
			ctx.fillRect(canvas.width / 2 - 1, 0, 2, canvas.height);// Dibuja la red
			ctx.fillRect(stateBall.x, stateBall.y, stateGame.ballWidth, stateGame.ballHeight);// Dibuja la bola
			ctx.fillRect(statePaddles.x1, statePaddles.y1, stateGame.playerWidth, stateGame.playerHeight); //Dibuja la paleta 1
			ctx.fillRect(statePaddles.x2, statePaddles.y2, stateGame.playerWidth, stateGame.playerHeight); //Dibuja la paleta 2
			if (responsedata.msg == 'scored'){
				checkFinish('score');
			}
		}
	} catch (error) {
		console.error('Error moving ball:', error);
	}
}

function animate(){
	isPaused = false;
	sleep(40);
	animationInterval = setInterval(moveBall, refreshTime);
	aiInterval = setInterval(playAI, refreshTime);
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function checkFinish(msg){
	console.log("checkFinish for = " + msg);
	isPaused = true;
	clearInterval(animationInterval);
	clearInterval(aiInterval);
	if (msg == 'score'){
		drawScores();
		if (statePaddles.score1 == stateGame.finalScore || statePaddles.score2 == stateGame.finalScore){
			gameOver();
		}else{
			resetBall(); //Reinicia la bola
			setTimeout(animate, 1000);
		}
	}
	//si es pause no hace nada
}

function gameOver(){
	let texto;
	if (statePaddles.score1 == stateGame.finalScore)
		texto = stateGame.name1;
	else 
		texto = stateGame.name2;
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
					showGameScreen();
					startPongLocal();
				}else if (result.isDenied){
					initPlayPage();
					return;
				}});
		};
	});
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
