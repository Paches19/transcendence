/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   players.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jutrera- <jutrera-@student.42madrid.com    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 18:46:00 by jutrera-          #+#    #+#             */
/*   Updated: 2024/04/08 18:46:00 by jutrera-         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */
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

function playerIA() {
    let level = Math.floor(Math.random() * 3) + 3;
    if (ball.y > playerTwo.y + playerTwo.height / 2 &&
        ball.x > canvas.width / 2 &&
        playerTwo.y + playerTwo.height + playerTwo.vy < canvas.height) {
        playerTwo.y += playerTwo.vy * playerTwo.vx / level;
    } else if (playerTwo.y - playerTwo.vy > 0 && ball.x > canvas.width / 2)
        playerTwo.y -= playerTwo.vy * playerTwo.vx / level;

	if (playerOne.score === 5 || playerTwo.score === 5) {
		return;
	}
	drawPlayer(playerTwo);
    requestAnimationFrame(playerIA);
}

const playerOne = new Player({
    x: 10,
});

const playerTwo = new Player({
    x: canvas.width - 15 - 10,
});
