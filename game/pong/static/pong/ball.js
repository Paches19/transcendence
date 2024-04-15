/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ball.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jutrera- <jutrera-@student.42madrid.com    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 18:45:27 by jutrera-          #+#    #+#             */
/*   Updated: 2024/04/08 18:45:27 by jutrera-         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */
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