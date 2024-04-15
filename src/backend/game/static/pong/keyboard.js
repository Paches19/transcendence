/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   keyboard.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jutrera- <jutrera-@student.42madrid.com    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 18:45:55 by jutrera-          #+#    #+#             */
/*   Updated: 2024/04/08 18:45:55 by jutrera-         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

window.addEventListener('keypress', doKeyDown, false);

function doKeyDown(e) {
    const key = e.key;
    if (key === 'w' && playerOne.y - playerOne.vy > 0)
        playerOne.y -= playerOne.vy * playerOne.vx;
    else if (key === 's' && playerOne.y + playerOne.height + playerOne.vy < canvas.height)
        playerOne.y += playerOne.vy * playerOne.vx;
    else if (!playerTwo.IA && key === 'p' && playerTwo.y - playerTwo.vy > 0)
        playerTwo.y -= playerTwo.vy * playerTwo.vx;
    else if (!playerTwo.IA && key === 'l' && playerTwo.y + playerTwo.height + playerTwo.vy < canvas.height)
        playerTwo.y += playerTwo.vy * playerTwo.vx;
	drawPlayer(playerOne);
	drawPlayer(playerTwo);
}
