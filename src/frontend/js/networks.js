
async function getState(){
	const apiUrl = `http://localhost:8000/api/get_state?id_match=${stateGame.id}`;
	try{
		const response = await fetch(apiUrl, {
			method: 'GET',
		});
		if (response.ok){
			const responsedata = await response.json();
			if (responsedata.ball.state == 'playing'){
				stateBall = responsedata.ball;
				stateGame = responsedata.game;
				statePaddles = responsedata.paddles;
				ctx.fillStyle = '#FFF';
				console.log("player 2 joined");
				document.getElementById('game-score').innerHTML =
					`${stateGame.name1} ${statePaddles.score1} - \
					${statePaddles.score2} ${stateGame.name2}`;
				startTimer();
			}
			if (responsedata.ball.state == 'paused'){
				stopAnimation();
			}
		}
	} catch (error) {
		console.error('Error getting state:', error);
	}
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
				stopAnimation();
				updateScores();
			}
		}
	} catch (error) {
		console.error('Error moving ball:', error);
	}
}

async function updateScores(){
	const apiUrl = 'http://localhost:8000/api/update_scores';
	try{
		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {'Content-Type': 'application/json',},
		});
		if (response.ok){
			const responsedata = await response.json();
			statePaddles.score1 = responsedata.score1;
			statePaddles.score2 = responsedata.score2;
			document.getElementById('game-score').innerHTML =
					`${stateGame.name1} ${statePaddles.score1} - \
					${statePaddles.score2} ${stateGame.name2}`;
			if (responsedata.msg == 'gameover'){
				gameOver();
			}else{
				resetBall();
				animate();
			}
		}
	} catch (error) {
		console.error('Error updating scores:', error);
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
			console.log("Ball reseted")
		}
	} catch (error) {
		console.error('Error reseting ball:', error);
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

async function newMatch(){
	var randomId = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
	try {
		const apiUrl = 'http://localhost:8000/api/new_match';
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {'Content-Type': 'application/json',},
			body: JSON.stringify( { id: randomId,
									name1: name1,
									name2: '',
									boundX: canvas.width,
									boundY: canvas.height
			}),
		});
		if (response.ok){
			Swal.fire({
				icon: "success",
				title: "New match code: " + randomId,
			});
			console.log("Match created with code: " + randomId);
			const responsedata = await response.json();
			stateGame = responsedata.game;
			stateBall = responsedata.ball;
			statePaddles = responsedata.paddles;
			//animate();
		}
	} catch(error) {
		console.error("Error: ", error);
		return false;
	}
}

async function joinMatch(matchId){
	const apiUrl = 'http://localhost:8000/api/join_match';
	try{
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {'Content-Type': 'application/json',},
			body: JSON.stringify( { id: matchId,
									name1: '',
									name2: name1,
									boundX: canvas.width,
									boundY: canvas.height
			}),
		});
		if (response.ok) {
			Swal.fire("Joined !");
			console.log("Match joined with code: " + matchId);
			const responsedata = await response.json();
			stateGame = responsedata.game;
			stateBall = responsedata.ball;
			statePaddles = responsedata.paddles;
			//animate();
		} else{
			Swal.fire({
				icon: "error",
				title: "Match not found " + response.status,
			});
			initPlayPage();
			return;
		}
	} catch(error) {
		console.error("Error: ", error);
		return false;
	}
}
