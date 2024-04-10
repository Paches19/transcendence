/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   navbar.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/10 17:23:01 by adpachec          #+#    #+#             */
/*   Updated: 2024/04/10 17:43:41 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { isLoggedIn } from './auth.js';

function updateNavbar() {
    const navBarDiv = document.getElementById('login-navbar');

    if (isLoggedIn()) {
        // Usuario logueado, mostrar información del usuario
        navBarDiv.innerHTML = `
            <div class="user-info" id="user-info">
                <a href="#" class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="path_to_default_avatar.jpg" id="user-avatar" class="rounded-circle" alt="User Avatar">
                    <span id="username">Username</span>
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><a class="dropdown-item" href="#profile">Profile</a></li>
                    <li><a class="dropdown-item" href="#friends">Friends</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" id="link-logout">Log out</a></li>
                </ul>
            </div>
        `;
    } else {
        // Usuario no logueado, mostrar botones de Log in y Register
        navBarDiv.innerHTML = `
            <a class="btn btn-outline-success me-2" href="#login">Log in</a>
            <a class="btn btn-outline-danger" href="#register">Register</a>
        `;
    }
}

export default updateNavbar;