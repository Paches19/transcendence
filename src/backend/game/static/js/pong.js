
let canvas = document.getElementById('pongGame');
let stateMatch = {
	'ball': {
		'x': canvas.width / 2- 5,
		'y': canvas.height / 2 - 5,
		'vx': 3,
		'vy': 0,
	},
	'player1': {
		'x': 10,
		'y': canvas.height / 2 - 40,
		'score': 0,
		'name': "",
	},
	'player2': {
		'x': canvas.width - 25,
		'y': canvas.height / 2 - 40,
		'score': 0,
		'name': "",
	},
	'state': 'waiting',
}
let v = 6;
let ballWidth = 10;
let ballHeight = 10;
let playerWidth = 15;
let playerHeight = 80;
let y = canvas.height / 2 - 40;
let player = "";
let finalScore = 3;

const playerName = document.getElementById(`player1-name`).innerHTML;
const currentUrl = window.location.href;
const currentNames = currentUrl.split("/");
const currentName = currentNames[currentNames.length - 2];
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

function resetBall(){
	stateMatch.ball.x = canvas.width / 2 - 5;
	stateMatch.ball.y = canvas.height / 2 - 5;
	stateMatch.ball.vx = 3;
	stateMatch.state = 'waiting';
	drawElements();
	setTimeout(waitMatch,3000);
}

function ballPaddleCollision(){
	if (stateMatch.ball.x <= stateMatch.player1.x){
		stateMatch.player2.score++;
		if (stateMatch.player2.score == finalScore){
			stateMatch.player2.winner = true
			socket.send(JSON.stringify({
				"event": 'game_over',
				"winner": stateMatch.player2.name,
			}));
		}
		resetBall();
	}
	else if (stateMatch.ball.x >= stateMatch.player2.x + playerWidth){
		stateMatch.player1.score++;
		if (stateMatch.player1.score == finalScore){
			stateMatch.player1.winner = true;
			socket.send(JSON.stringify({
				"event": 'game_over',
				"winner": stateMatch.player1.name,
			}));
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

function ballBounce() {
	if (stateMatch.ball.y + stateMatch.ball.vy <= 0 || stateMatch.ball.y + stateMatch.ball.vy >= canvas.height) {
		stateMatch.ball.vy = -stateMatch.ball.vy;
	}
	stateMatch.ball.y += stateMatch.ball.vy;
	stateMatch.ball.x += stateMatch.ball.vx;
	ballPaddleCollision();
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

// function player2IA() {
// 	let level = Math.floor(Math.random() * 3) + 3;
// 	if (stateMatch.ball.y > stateMatch.player2.y + playerHeight / 2 &&
// 		stateMatch.ball.x > canvas.width / 2 &&
// 		stateMatch.player2.y + playerHeight + v < canvas.height) {
// 			stateMatch.player2.y += v / level;
// 	} else if (stateMatch.player2.y - v > 0 && stateMatch.ball.x > canvas.width / 2){
// 		stateMatch.player2.y -= v / level;
// 	}

// 	if (stateMatch.state === 'ended'){
// 		return;
// 	}
// 	requestAnimationFrame(player2IA);
// }

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
		document.getElementById("player1-name").innerHTML = stateMatch.player1.name;
		document.getElementById("player2-name").innerHTML = stateMatch.player2.name ;
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

document.addEventListener('keydown', handleKeyDown);
