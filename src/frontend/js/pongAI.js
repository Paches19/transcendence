
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

import {initPlayPage, pauseGame, resetTime} from "./play.js";

let canvas
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
	},
	'player2': {
		'x': 0,
		'y': 0,
		'score': 0,

	},
	'state': 'waiting',
}
let v = 10;
let ballWidth = 10;
let ballHeight = 10;
let playerWidth = 15;
let playerHeight = 80;
let finalScore = 1;
let name1;
let name2;
let ctx;

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

function player2IA() {
	if (stateMatch.state == 'gameover'){
		return;
	}
	if (stateMatch.state == 'playing'){
		let level = Math.floor(Math.random() * 3) + 3;
	
		if (stateMatch.ball.y > stateMatch.player2.y + playerHeight / 2 &&
			stateMatch.ball.x > canvas.width / 2 &&
			stateMatch.player2.y + playerHeight + v < canvas.height) {
				stateMatch.player2.y += v / level;
		} else if (stateMatch.player2.y - v > 0 && stateMatch.ball.x > canvas.width / 2){
			stateMatch.player2.y -= v / level;
		}
	}
	requestAnimationFrame(player2IA);
}

function waitMatch(){
	stateMatch.state = 'playing';
}

function quitGameAI(){
	stateMatch.state = 'gameover';
}

function gameOver(){
	pauseGame();
	stateMatch.state = 'gameover';
	let texto;
	if (stateMatch.player1.score == finalScore)
		texto = "YOU WIN";
	else
		texto = "YOU LOSE";

	Swal.fire(texto).then((result) => {	
		if (result.isConfirmed){
			Swal.fire({
				title: "Play again ?",
				showDenyButton: true,
				showCancelButton: false,
				confirmButtonText: "Yes",
				denyButtonText: `No`
			  }).then((result) => {
				if (result.isConfirmed) {
					resetTime();
					initGameAI();
				}else if (result.isDenied){
					initPlayPage();
				}});
		};
	});
}

function initGameAI(){
	console.log('Game initialized');
	canvas = document.getElementById('pong-game');
	ctx = canvas.getContext('2d');
	ctx.fillStyle = 'white';
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
	loop();
	player2IA()
	setTimeout(waitMatch,3000);
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
	setTimeout(waitMatch,3000);
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
			gameOver();

		}
		else
			resetBall();
	}
	else if (stateMatch.ball.x >= stateMatch.player2.x + playerWidth){
		stateMatch.player1.score++;
		drawScores();
		if (stateMatch.player1.score == finalScore){
			gameOver();
		}
		else{
			resetBall();

		}
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
	document.getElementById('game-score').innerHTML = `${name1} ${stateMatch.player1.score} - ${stateMatch.player2.score} ${name2} (IA)`;
}

function drawElements() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall(); 
	drawNet();
	drawPaddles();
}

function handleKeyDown(e) {
    const key = e.key;

    let y = stateMatch.player1.y;
    if ((key === 'ArrowUp' && y - v > 0) ||
        (key === 'ArrowDown' && y + playerHeight + v < canvas.height))
       		 y += key === 'ArrowUp' ? -v : v;
    stateMatch.player1.y = y;
	drawElements();
}

export {initGameAI, quitGameAI};
