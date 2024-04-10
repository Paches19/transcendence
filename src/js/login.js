/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   login.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 12:21:53 by adpachec          #+#    #+#             */
/*   Updated: 2024/04/10 13:49:47 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { login } from './auth.js';

function loadLogin() {
    document.getElementById('main-content').innerHTML = `
		<div class="wrapper">
			<div class="flip-card__inner">
				<div class="flip-card__front">
					<div class="title">Log in</div>
						<form action="" class="flip-card__form">
							<input type="text" placeholder="Name" id="username" class="flip-card__input">
							<input type="password" placeholder="Password" id="password" class="flip-card__input">
							<button type="button" class="flip-card__btn" id="login-btn">Let's go!</button>
						</form>
				</div>
			</div>   
		</div>
    `;
	
	const loginButton = document.getElementById('login-btn');
	loginButton.addEventListener('click', () => {
		const username = document.getElementById('username').value;
		const password = document.getElementById('password').value;
		console.log("username: ", username);
		console.log("password: ", password);
	});

	document.getElementById('include-content').innerHTML = `
		<link rel="stylesheet" href="css/login.css">
	`;
}

export default loadLogin;