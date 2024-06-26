
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pongRemote.js                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jutrera- <jutrera-@student.42madrid.com    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 11:49:24 by adpachec          #+#    #+#             */
/*   Updated: 2024/05/03 20:39:19 by jutrera-         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import {initPlayPage, resetTime} from "./play.js";

let socket;
let canvas;
let stateMatch = {
	'ball': {
		'x': 0,
		'y': 0,
		'vx': 0,
		'vy': 0,
	},
	'player1': {
		'x': 0,
		'y': 0,
		'score': 0,
		'name': "",
	},
	'player2': {
		'x': 0,
		'y': 0,
		'score': 0,
		'name': "",
	},
	'state': 'waiting',
}
let v = 10;
let ballWidth = 10;
let ballHeight = 10;
let playerWidth = 15;
let playerHeight = 80;
let y;
let player = "";
let name1;
let name2;
let finalScore = 3;
let ctx;
let winner;

function loop() {	
	if (stateMatch.state == 'gameover'){
		return;
	}
	if (stateMatch.state == 'playing'){
		ballBounce();
		drawElements();
	}
	requestAnimationFrame(loop);
}

function playRemote(){
	stateMatch.state = 'playing';
}

function quitRemote(){
	stateMatch.state = 'gameover';
}

function pauseRemote(){
	stateMatch.state = 'waiting';
}

function gameOver(){
	pauseRemote();
	socket.send(JSON.stringify({
		"event": 'game_over',
		"winner": winner,
	}));
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
					initGameRemote();
				}else if (result.isDenied){
					initPlayPage();
				}});
		};
	});
}

function initGameRemote(){
	console.log('Game initialized');
	canvas = document.getElementById('pong-game');
	ctx = canvas.getContext('2d');
	ctx.fillStyle = 'white';
	socket = new WebSocket("ws://localhost:8080/ws/game/remote/1");
	document.addEventListener('keydown', handleKeyDown);
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
		},
		'player2': {
			'x': canvas.width - 25,
			'y': canvas.height / 2 - 40,
			'score': 0,
	
		},
		'state': 'waiting',
	}
	var words = document.getElementById('game-score').textContent.split(' ');
    name1 = words[0];
	name2 = words[4];	
	drawElements();
	drawScores();
	stateMatch.ball.vx = Math.floor(Math.random() * 7) - 3;
	stateMatch.ball.vy = Math.floor(Math.random() * 7) - 3;
	if (stateMatch.ball.vx == 0)
		stateMatch.ball.vx = 4;
	if (stateMatch.ball.vy == 0)
		stateMatch.ball.vy = 4
	y = canvas.height / 2 - 40;
	loop();
	setTimeout(playRemote,3000);
}

function resetBall(){
	stateMatch.ball.x = canvas.width / 2 - 5;
	stateMatch.ball.y = canvas.height / 2 - 5;
	stateMatch.ball.vx = Math.floor(Math.random() * 7) - 3;
	stateMatch.ball.vy = Math.floor(Math.random() * 7) - 3;
	if (stateMatch.ball.vx == 0)
		stateMatch.ball.vx = 4;
	if (stateMatch.ball.vy == 0)
		stateMatch.ball.vy = 4
	stateMatch.state = 'waiting';
	drawElements();
	setTimeout(playHuman,3000);
}

function ballBounce() {
	if (stateMatch.ball.y + stateMatch.ball.vy <= 0 || stateMatch.ball.y + stateMatch.ball.vy >= canvas.height) {
		stateMatch.ball.vy = -stateMatch.ball.vy;
	}
	stateMatch.ball.y += stateMatch.ball.vy;
	stateMatch.ball.x += stateMatch.ball.vx;
	ballPaddleCollision();
}

function ballPaddleCollision(){
	if (stateMatch.ball.x <= stateMatch.player1.x){
		stateMatch.player2.score++;
		drawScores();
		if (stateMatch.player2.score == finalScore){
			stateMatch.player2.winner = true;
			winner = stateMatch.player2.name;
			gameOver();
		}
		resetBall();
	}
	else if (stateMatch.ball.x >= stateMatch.player2.x + playerWidth){
		stateMatch.player1.score++;
		drawScores();
		if (stateMatch.player1.score == finalScore){
			stateMatch.player1.winner = true;
			winner = stateMatch.player1.name;
			gameOver();
		}
		resetBall();
	}
	else if ((stateMatch.ball.y <= stateMatch.player2.y + playerHeight &&
			  stateMatch.ball.y >= stateMatch.player2.y &&
			  stateMatch.ball.x + ballWidth >= stateMatch.player2.x) ||
	  		 (stateMatch.ball.y  <= stateMatch.player1.y + playerHeight &&
			  stateMatch.ball.y  >= stateMatch.player1.y &&
			  stateMatch.ball.x  <= stateMatch.player1.x + playerWidth)){
		  			stateMatch.ball.vx = -stateMatch.ball.vx;
		  			if (stateMatch.ball.x > stateMatch.player1.x && 
				  		stateMatch.ball.x < stateMatch.player1.x + playerWidth)
				  			stateMatch.ball.x = stateMatch.player1.x + playerWidth + 1;
	  
				    if (stateMatch.ball.x > stateMatch.player2.x && 
			  		    stateMatch.ball.x < stateMatch.player2.x + playerWidth)
				  			stateMatch.ball.x = stateMatch.player2.x - ballWidth - 1;
		  
					 if ((stateMatch.ball.y > stateMatch.player1.y + playerHeight * 0.75 ||
				  		  stateMatch.ball.y > stateMatch.player2.y + playerHeight * 0.75) &&
				  		  stateMatch.ball.vy < 3)
							stateMatch.ball.vy += 1;

		  			 if ((stateMatch.ball.y < stateMatch.player1.y + playerHeight * 0.25 ||
					  	  stateMatch.ball.y < stateMatch.player2.y + playerHeight * 0.25) &&
						  stateMatch.ball.vy > -3)
						 	stateMatch.ball.vy -= 1;
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
}

function handleKeyDown(e) {
    const key = e.key;
    let y;
    if (player == "1") {
        y = stateMatch.player1.y;
    } else {
        y = stateMatch.player2.y;
    }
    if ((key === 'ArrowUp' && y - v > 0) ||
        (key === 'ArrowDown' && y + playerHeight + v < canvas.height))
        y += key === 'ArrowUp' ? -v : v;
    if (player == "1") {
        stateMatch.player1.y = y;
    } else if (player == "2") {
        stateMatch.player2.y = y;
    }
    socket.send(JSON.stringify({
        "event": 'game_update',
        "stateMatch": stateMatch,
    }));
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

export { initGameRemote, playRemote, quitRemote, pauseRemote};
