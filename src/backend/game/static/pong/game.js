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
