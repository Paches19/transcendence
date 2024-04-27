/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   navbar.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/10 17:23:01 by adpachec          #+#    #+#             */
/*   Updated: 2024/04/27 13:31:54 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { isLoggedIn } from './auth.js';

function updateNavbar()
{
	const navBarDiv = document.getElementById('login-navbar');

	const mockUser =
	{
		username: "user1",
		avatar: "./images/avatar/author_1.png"
	};
	
	if (isLoggedIn())
	{
		navBarDiv.innerHTML = `
			<div class="user-info" id="user-info">
				<a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
					<img src="${mockUser.avatar}" id="user-avatar" class="rounded-circle" alt="User Avatar">
					<span id="username">${mockUser.username}</span>
				</a>
				<ul class="dropdown-menu" aria-labelledby="navbarDropdown">
					<li><a class="dropdown-item" data-route="/edit-profile">Edit Profile</a></li>
					<li><hr class="dropdown-divider"></li>
					<li><a class="dropdown-item" id="link-logout">Log out</a></li>
				</ul>
			</div>
			<div id="tournament-nav-items" style="display: none;">
				
			</div>
		`;
	}
	else
	{
		navBarDiv.innerHTML = `
			<a class="btn btn-outline-success me-2" data-route="/login">Log in</a>
			<a class="btn btn-outline-danger" data-route="/register">Register</a>
			<div id="tournament-nav-items" style="display: none;">
				
			</div>
		`;
	}
}


export default updateNavbar;