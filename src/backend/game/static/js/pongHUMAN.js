
let canvas = document.getElementById('pongGame');
let stateMatch = {
	'ball': {
		'x': canvas.width / 2- 5,
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
let v = 6;
let ballWidth = 10;
let ballHeight = 10;
let playerWidth = 15;
let playerHeight = 80;
let finalScore = 1;

const ctx = canvas.getContext('2d');

function loop() {
	if (stateMatch.state == 'ended'){
		return;
	}
	if (stateMatch.state == 'playing'){
		ballBounce();
		drawElements();
	}
	requestAnimationFrame(loop);
}

function waitMatch(){
	stateMatch.state = 'playing';
}

function initGame(){
	drawElements();
	stateMatch.ball.vx = Math.floor(Math.random() * 7) - 3;
	stateMatch.ball.vy = Math.floor(Math.random() * 7) - 3;
	if (stateMatch.ball.vx == 0)
		stateMatch.ball.vx = 4;
	if (stateMatch.ball.vy == 0)
		stateMatch.ball.vy = 4
	loop();
	setTimeout(waitMatch,3000);
}
	
function gameOver(){
	stateMatch.state = 'ended';
	drawElements();
	if (stateMatch.player1.score == finalScore)
		texto = "YOU WIN";
	else
		texto = "YOU LOSE";

	Swal.fire(texto).then((result) => {	
		if (result.isConfirmed)
			window.location.href = '../templates/index2.html';});
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
		if (stateMatch.player2.score == finalScore){
			gameOver();
		}
		else
			resetBall();
	}
	else if (stateMatch.ball.x >= stateMatch.player2.x + playerWidth){
		stateMatch.player1.score++;
		if (stateMatch.player1.score == finalScore){
			gameOver();
		}
		else
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
	if (document.fonts.check('1em PressStart2P')) {
		ctx.font = '50px PressStart2P';
		ctx.fillText(stateMatch.player1.score, canvas.width / 2 - 70, 70);
		ctx.fillText(stateMatch.player2.score, canvas.width / 2 + 25, 70);

	}
	else {
		setTimeout(drawScores, 100);
	}
}

function drawElements() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'white';
	drawBall();
	drawNet();
	drawPaddles();
	drawScores();
}

function handleKeyDown(e) {
    const key = e.key;

    y1 = stateMatch.player1.y;
    if ((key === 'ArrowUp' && y1 - v > 0) ||
        (key === 'ArrowDown' && y1 + playerHeight + v < canvas.height))
       		 y1 += key === 'ArrowUp' ? -v : v;
    stateMatch.player1.y = y1;

	y2 = stateMatch.player2.y;
    if (((key === 'Q' || key == 'q') && y2 - v > 0) ||
        ((key === 'A' || key == 'a') && y2 + playerHeight + v < canvas.height))
       		 y2 += (key === 'Q' || key == 'q') ? -v : v;
    stateMatch.player2.y = y2;

	drawElements();
}

document.addEventListener('keydown', handleKeyDown);

initGame();	