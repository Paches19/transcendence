/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   start.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jutrera- <jutrera-@student.42madrid.com    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 18:46:05 by jutrera-          #+#    #+#             */
/*   Updated: 2024/04/08 18:46:05 by jutrera-         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

var canvas = document.getElementById('pongGame');

const ctx = canvas.getContext('2d');

document.addEventListener("DOMContentLoaded", function () {
		console.log('Clicked play against AI button');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		initElements();
		drawElements();
		ball.state = 'playing';
        setTimeout(function(){
			playerTwo.IA = true;
			playerIA();
			loop();
			}, 3000);
});