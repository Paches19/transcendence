/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   login.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 12:21:53 by adpachec          #+#    #+#             */
/*   Updated: 2024/04/22 14:15:43 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { login } from './auth.js';
import updateNavbar from "./navbar.js";
import router from './main.js';

function loadLogin()
{
	document.getElementById('main-content').innerHTML = `
		<div class="wrapper">
			<div class="flip-card__inner">
				<div class="flip-card__front">
					<div class="title">Log in</div>
						<form action="" class="flip-card__form">
							<input type="text" placeholder="Name" id="username" class="flip-card__input">
							<input type="password" placeholder="Password" id="password" class="flip-card__input">
							<button type="button" class="flip-card__btn" id="login-btn">Let's go!</button>
							<div class="text" id="login-msg"> </div>
						</form>
				</div>
			</div>   
		</div>
	`;
	
	const loginButton = document.getElementById('login-btn');
	loginButton.addEventListener('click', () =>
	{
		const username = document.getElementById('username').value;
		const password = document.getElementById('password').value;
		
		if (login(username, password))
		{
			updateNavbar();
			document.getElementById('login-msg').innerText = 'You have ponged in!. Ready to rack up some pong-tastic points?';
			setTimeout(() => {
				const shouldRedirectBack = localStorage.getItem('loginRedirect');
				if (!shouldRedirectBack) {
					window.history.back();
				} else {
					localStorage.removeItem('loginRedirect');
					router.route('/profile');
				}
			}, 1500);
		}
		else
		{
			document.getElementById('login-msg').innerText = 'Hmm, that username and password don´t seem to match. Are you sure you´re not trying to log into your ex´s account?';
		}
	});
}

export default loadLogin;