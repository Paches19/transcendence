
let board = {
	0: '', 1: '', 2: '',
	3: '', 4: '', 5: '',
	6: '', 7: '', 8: '',
}
let playerLetter = ""
let myTurn = false

const turnElm = document.getElementById("turn")
const opponentTxt = document.getElementById("opponent-txt")
const boxes = document.getElementsByClassName("box")

Array.from(boxes).forEach((elm, i) => {
	elm.addEventListener("click", e => {
		if (myTurn && !elm.innerHTML && !elm.getAttribute("player")){
			board[i] = playerLetter
			ws.send(JSON.stringify({
				"event": 'boardData_send',
				"board": board,
			}))
			addPlayerLetter(elm, playerLetter)
			myTurn = false;
		}
	})            
})

function addPlayerLetter(element, symbol) {
	element.innerHTML = `<p class="player-letter" >${symbol}</p>`
	element.setAttribute("player", symbol)
	setTimeout(() => {
		element.children[0].classList.add("active")
	}, 1);
}

function resetBoard() {
	Array.from(boxes).forEach(elm => {
		elm.innerHTML = ''
		elm.setAttribute("player", "")
	})
}

function updateBoard(boardData) {
	Array.from(boxes).forEach((elm, i) => {
		if(boardData[i] != "" && !elm.getAttribute("player")){
			addPlayerLetter(elm, boardData[i])
		}
	})
}

ws.onopen = e => {
	console.log(e)
}

ws.onmessage = e => {
	console.log(e)
	const data = JSON.parse(e.data)
	if(data.event == "show_error"){
		Swal.fire({
			icon: "error",
			title: data.error,
		}).then(e => window.location.href = "/")
	}

	else if(data.event == "game_start"){
		board = data.board
		myTurn = data.turn
		playerLetter = data.symbol
		resetBoard()
		turnElm.innerHTML = data.turn ? "Your Turn" : "Opponent's Turn"
		opponentTxt.innerHTML = "Opponent joined"
		setTimeout(() => {
			Swal.close()
		}, 500);
	}

	else if(data.event == "boardData_send"){
		board = data.board
		myTurn = data.turn
		updateBoard(board)
		turnElm.innerHTML = data.turn ? "Your Turn" : "Opponent's Turn"
	}

	else if(data.event == "won"){
		board = data.board
		myTurn = data.turn
		updateBoard(board)
		turnElm.innerHTML = data.winner == playerLetter? "You Won": "You Lost"
		setTimeout(() => {
			Swal.fire({
				icon:  data.winner == playerLetter ?'success': "error",
				title:  data.winner == playerLetter ?'You Won': "You Lost",
				confirmButtonText: "Restart"
			}).then(e =>  ws.send(JSON.stringify({event: 'restart',})))
		}, 400);
	}

	else if(data.event == "draw"){
		board = data.board
		myTurn = data.turn
		updateBoard(board)
		turnElm.innerHTML = "Draw"
		setTimeout(() => {
			Swal.fire({
				icon:  "info",
				title:  "Draw",
				confirmButtonText: "Restart"
			}).then(e =>  ws.send(JSON.stringify({event: 'restart',})))
		}, 400);
	}
	
	else if(data.event == "opponent_left"){
		board = data.board
		myTurn = data.turn
		resetBoard()
		turnElm.innerHTML = "Opponent Left"
		opponentTxt.innerHTML = "Opponent (waiting to join)"
		setTimeout(() => {
			Swal.fire({
				icon:  "info",
				title:  "Opponent Left",
				confirmButtonText: "Ok"
			})
		}, 400);
	}
}
