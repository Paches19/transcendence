/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   game.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jutrera- <jutrera-@student.42madrid.com    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 18:45:51 by jutrera-          #+#    #+#             */
/*   Updated: 2024/04/08 18:45:51 by jutrera-         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const socket = new WebSocket("ws://" + window.location.host + "/ws/game/{{room.id}}/");

var canvas = document.getElementById('pongGame');

const ctx = canvas.getContext('2d');

// Define sendPlayerInput function outside of the DOMContentLoaded event listener
const sendPlayerInput = (input) => {
    const data = { key: input };
    socket.send(JSON.stringify(data));
};

document.addEventListener("DOMContentLoaded", () => {
    socket.onopen = () => {
        console.log("WebSocket connected");
    };

	socket.onmessage = e => {
		console.log(e)
		const data = JSON.parse(e.data)
		if(data.event == "show_error"){
			Swal.fire({
				icon: "error",
				title: data.error,
			}).then(e => window.location.href = "/")
		}
		else if(data.event == "update_game"){
			updateGameState(data.game)
		}
	}
	// Start the game loop
	//loop();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	initElements();
	drawElements();
	ball.state = 'playing';

	document.addEventListener('keydown', function(e) {
		const key = e.key;
		console.log("Key pressed:", key); // Log the pressed key
		if ((key === 'ArrowUp' && playerOne.y > 0) || 
			(key === 'ArrowDown' && playerOne.y + playerOne.height < canvas.height - 5))
			console.log("Sending player input:", key); // Log the key being sent   
			sendPlayerInput(key, playerOne);
	});	
});

function loop() {
    if (checkGameOver()) {
   		setTimeout(function () {
			window.location.href = document.getElementById("home-url").dataset.url;
    	}, 3000);
		return;
    }
    if (ball.state === 'playing')
		ballBounce();
    requestAnimationFrame(loop);
}


function updateGameState(gameState) {
	playerOne.y = gameState.playerOne.y;
	playerTwo.y = gameState.playerTwo.y;
	ball.x = gameState.ball.x;
	ball.y = gameState.ball.y;
	playerOne.score = gameState.playerOne.score;
	playerTwo.score = gameState.playerTwo.score;
	drawElements();
}

class Player {
    constructor(options) {
        this.x = options.x;
        this.y = options.y || canvas.height / 2 - 40;
        this.width = options.width || 15;
        this.height = options.height || 80;
        this.color = options.color || 'white';
        this.vx = options.vx || 4;
        this.vy = options.vy || 4;
        this.score = options.score || 0;
        this.IA = options.IA || false;
		this.won = options.won || 0;
		this.lost = options.lost || 0;
    }
}

// function playerIA() {
//     let level = Math.floor(Math.random() * 3) + 3;
//     if (ball.y > playerTwo.y + playerTwo.height / 2 &&
//         ball.x > canvas.width / 2 &&
//         playerTwo.y + playerTwo.height + playerTwo.vy < canvas.height) {
//         playerTwo.y += playerTwo.vy * playerTwo.vx / level;
//     } else if (playerTwo.y - playerTwo.vy > 0 && ball.x > canvas.width / 2)
//         playerTwo.y -= playerTwo.vy * playerTwo.vx / level;

// 	if (playerOne.score === 5 || playerTwo.score === 5) {
// 		return;
// 	}
// 	drawPlayer(playerTwo);
//     requestAnimationFrame(playerIA);
// }

const playerOne = new Player({
    x: 10,
});

const playerTwo = new Player({
    x: canvas.width - 15 - 10,
});

class Ball {
    constructor(options) {
        this.x = options.x || canvas.width / 2 - 5;
        this.y = options.y || canvas.height / 2 - 5;
        this.width = options.width || 10;
        this.height = options.height || 10;
        this.color = options.color || 'white';
        this.vx = options.vx;
        this.vy = options.vy;
		this.state = options.state || 'stopped';
    }
}

const ball = new Ball({
    vx: 4,
    vy: 3
});

function ballBounce() {
	ctx.clearRect(ball.x, ball.y, ball.width, ball.height);
	drawPlayer(playerOne);
	drawPlayer(playerTwo);
    if (ball.y + ball.vy <= 0 || ball.y + ball.vy >= canvas.height) {
        ball.vy = -ball.vy;
        ball.y += ball.vy;
        ball.x += ball.vx;
    } else {
        ball.y += ball.vy;
        ball.x += ball.vx;
    }
    ballWallCollision();
}

function ballWallCollision(){
	if(	(ball.y + ball.vy <= playerTwo.y + playerTwo.height &&
		 ball.y + ball.vy >= playerTwo.y &&
		 ball.x + ball.width + ball.vx > playerTwo.x ) ||
		(ball.y + ball.vy <= playerOne.y + playerOne.height &&
		 ball.y + ball.vy >= playerOne.y &&
		 ball.x + ball.vx < playerOne.x + playerOne.width)){
			ball.vx = -ball.vx;
			if (ball.x > playerOne.x && ball.x < playerOne.x + playerOne.width)
				ball.x = playerOne.x + ball.width;
		
			if(ball.x > playerTwo.x && ball.x < playerTwo.x + playerTwo.width)
				ball.x = playerTwo.x - ball.width;
			
			if (ball.vy === 0) 
				ball.vy = 1;
			
			if ((ball.y > playerOne.y + playerOne.height/2 ||
			    ball.y > playerTwo.y + playerTwo.height/2) &&
				ball.vy < 0)
					ball.vy = -ball.vy;
			else if ((ball.y < playerOne.y + playerOne.height/2 ||
		    	ball.y < playerTwo.y + playerTwo.height/2) &&
				ball.vy > 0)
					ball.vy = -ball.vy;
	}
	else if(ball.x + ball.vx <= playerOne.x){
		playerTwo.score++;
		drawScore(playerTwo.score, canvas.width / 2 + 25);
		resetBall();
	}
	else if(ball.x + ball.vx >= playerTwo.x + playerTwo.width){
		playerOne.score++;
		resetBall();
	}
	drawScore(playerOne.score, canvas.width / 2 - 70);
	drawScore(playerTwo.score, canvas.width / 2 + 25);
	drawNet();
	drawBall();
}

function resetBall(){
	ball.state = 'stopped';
	ball.x = canvas.width / 2 - 5;
	ball.y = canvas.height / 2 - 5;
	ball.vx = 4;
	ball.vy = 3;
	setTimeout(waitMatch,3000);
}

function waitMatch(){
	ball.state = 'playing';
}

//draw the paddles
function drawPlayer(player){
	//ctx.clearRect(player.x, 0, player.width, canvas.height);
	ctx.fillStyle = player.color;
	ctx.fillRect(player.x, player.y, player.width, player.height);
}

//draw the ball
function drawBall(){
	ctx.fillStyle = ball.color;
	ctx.fillRect(ball.x, ball.y, ball.width, ball.height);
}

//draw the net
function drawNet(){
	ctx.fillStyle = 'white';
	ctx.fillRect(canvas.width / 2 - 1, 0, 2, canvas.height);
}

//draw Scores
function drawScore(score, x){
 	if (document.fonts.check('1em PressStart2P')) {
		ctx.fillStyle = 'white';
		ctx.font = '50px PressStart2P';
		ctx.clearRect(x, 0, canvas.width / 2 - 69, 100);
		ctx.fillText(score, x, 70);
	}
	else {
		setTimeout(drawScore, 100);
	}
}

function drawElements(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawPlayer(playerOne);
	drawPlayer(playerTwo);
	drawBall();
	drawScore(playerOne.score, canvas.width / 2 - 70);
	drawScore(playerTwo.score, canvas.width / 2 + 25);
	drawNet();
}

function checkGameOver() {
    if (playerOne.score === 5 || playerTwo.score === 5) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (playerOne.score === 5)
            ctx.fillText("Player One", canvas.width / 2 - 250, canvas.height / 2);
        else if (!playerTwo.IA)
            ctx.fillText("Player Two", canvas.width / 2 - 250, canvas.height / 2);
        else
			ctx.fillText(" Computer ", canvas.width / 2 - 250, canvas.height / 2);
		
		ctx.fillText("  wins!", canvas.width / 2 - 210, canvas.height / 2 + 50);
        
		return true;
    }
    return false;
}

function initElements(){
	playerOne.x = 10;
	playerOne.y = canvas.height / 2 - 40;
	playerOne.score = 0;
	
	playerTwo.x = canvas.width - 15 - 10;
	playerTwo.y = canvas.height / 2 - 40;
	playerTwo.score = 0;

	ball.x = canvas.width / 2 - 5;
	ball.y = canvas.height / 2 - 5;
}


