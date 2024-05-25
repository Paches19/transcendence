
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pongAI.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jutrera- <jutrera-@student.42madrid.com    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 11:49:24 by adpachec          #+#    #+#             */
/*   Updated: 2024/05/03 20:39:19 by jutrera-         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import {initPlayPage, resetTime} from "./play.js";

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
let ctx;
let canvas;

function startPong(mode){
	document.addEventListener('keydown', handleKeyDown);
	console.log('Game initialized');
	canvas = document.getElementById('pong-game');
	ctx = canvas.getContext('2d');
	ctx.fillStyle = 'white';
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
	sendState('start');
	playPong();
	loop();
}

function loop() {
	if (stateMatch.state == 'gameover'){
		return;
	}
	updateGame();
	drawElements();
	requestAnimationFrame(loop);
}

function sendState(msg){
	if (socket){
		socket.send(JSON.stringify({
			"event": msg,
			"match": stateMatch,
		}));
	}
}

function playPong(mode){
	stateMatch.state = 'playing';
	sendState('playing');
}

function quitPong(mode){
	sendState('pause', mode);
	Swal.fire({
		confirmButtonColor: '#32B974',
		title: "Are you sure ?",
		showDenyButton: true,
		showCancelButton: false,
		confirmButtonText: "Yes",
		denyButtonText: `No`
	  }).then((result) => {
			if (result.isConfirmed) {
				stateMatch.state = 'gameover';
			}else if (result.isDenied){
				playPong(mode);
			}});
}

function pausePong(){
	sendState('pause');
}

function handleKeyDown(e) {
    const key = e.key;
	if (socket && key == 'ArrowUp' && key == 'ArrowDown' &&
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
	document.getElementById('game-score').innerHTML = `${name1} ${stateMatch.player1.score} - ${stateMatch.player2.score} ${name2}`;
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
	pausePong();
	stateMatch.state = 'gameover';
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


if (socket){
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

// function playerAI() {
// 	if (stateMatch.state == 'gameover'){
// 		return;
// 	}
// 	if (stateMatch.state == 'playing'){
// 		let level = Math.floor(Math.random() * 3) + 3;
	
// 		if (stateMatch.ball.y > stateMatch.player2.y + playerHeight / 2 &&
// 			stateMatch.ball.x > canvas.width / 2 &&
// 			stateMatch.player2.y + playerHeight + v < canvas.height) {
// 				stateMatch.player2.y += v / level;
// 		} else if (stateMatch.player2.y - v > 0 && stateMatch.ball.x > canvas.width / 2){
// 			stateMatch.player2.y -= v / level;
// 		}
// 	}
// 	requestAnimationFrame(playerAI);
// }

// function resetBall(){
// 	stateMatch.ball.x = canvas.width / 2 - 5;
// 	stateMatch.ball.y = canvas.height / 2 - 5;
// 	stateMatch.ball.vx = Math.floor(Math.random() * 7) - 3;
// 	stateMatch.ball.vy = Math.floor(Math.random() * 7) - 3;
// 	if (stateMatch.ball.vx == 0)
// 		stateMatch.ball.vx = 4;
// 	if (stateMatch.ball.vy == 0)
// 		stateMatch.ball.vy = 4
// 	stateMatch.state = 'waiting';
// 	drawElements();
// 	setTimeout(playAI,3000);
// }

// function ballBounce() {
// 	if (stateMatch.ball.y + stateMatch.ball.vy <= 0 || stateMatch.ball.y + stateMatch.ball.vy >= canvas.height) {
// 		stateMatch.ball.vy = -stateMatch.ball.vy;
// 	}
// 	stateMatch.ball.y += stateMatch.ball.vy;
// 	stateMatch.ball.x += stateMatch.ball.vx;
// 	ballPaddleCollision();
// }

// function ballPaddleCollision(){
// 	if (stateMatch.ball.x <= stateMatch.player1.x){
// 		stateMatch.player2.score++;
// 		drawScores();
// 		if (stateMatch.player2.score == finalScore){
// 			gameOver();

// 		}
// 		else
// 			resetBall();
// 	}
// 	else if (stateMatch.ball.x >= stateMatch.player2.x + playerWidth){
// 		stateMatch.player1.score++;
// 		drawScores();
// 		if (stateMatch.player1.score == finalScore){
// 			gameOver();
// 		}
// 		else{
// 			resetBall();

// 		}
// 	}
// 	else if ((stateMatch.ball.y <= stateMatch.player2.y + playerHeight &&
// 			  stateMatch.ball.y >= stateMatch.player2.y &&
// 			  stateMatch.ball.x + ballWidth >= stateMatch.player2.x) ||
// 	  		 (stateMatch.ball.y  <= stateMatch.player1.y + playerHeight &&
// 			  stateMatch.ball.y  >= stateMatch.player1.y &&
// 			  stateMatch.ball.x  <= stateMatch.player1.x + playerWidth)){
// 		  			stateMatch.ball.vx = -stateMatch.ball.vx;
// 		  			if (stateMatch.ball.x > stateMatch.player1.x && 
// 				  		stateMatch.ball.x < stateMatch.player1.x + playerWidth)
// 				  			stateMatch.ball.x = stateMatch.player1.x + playerWidth + 1;
	  
// 				    if (stateMatch.ball.x > stateMatch.player2.x && 
// 			  		    stateMatch.ball.x < stateMatch.player2.x + playerWidth)
// 				  			stateMatch.ball.x = stateMatch.player2.x - ballWidth - 1;
		  
// 					 if ((stateMatch.ball.y > stateMatch.player1.y + playerHeight * 0.75 ||
// 				  		  stateMatch.ball.y > stateMatch.player2.y + playerHeight * 0.75) &&
// 				  		  stateMatch.ball.vy < 3)
// 							stateMatch.ball.vy += 1;

// 		  			 if ((stateMatch.ball.y < stateMatch.player1.y + playerHeight * 0.25 ||
// 					  	  stateMatch.ball.y < stateMatch.player2.y + playerHeight * 0.25) &&
// 						  stateMatch.ball.vy > -3)
// 						 	stateMatch.ball.vy -= 1;
//   }
// }

export {startPong, quitPong, pausePong, playPong};
