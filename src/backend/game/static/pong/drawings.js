/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   drawings.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jutrera- <jutrera-@student.42madrid.com    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 18:45:41 by jutrera-          #+#    #+#             */
/*   Updated: 2024/04/08 18:45:41 by jutrera-         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

//draw the paddles
function drawPlayer(player){
	ctx.clearRect(player.x, 0, player.width, canvas.height);
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
