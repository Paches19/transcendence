/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   auth.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/10 11:27:22 by adpachec          #+#    #+#             */
/*   Updated: 2024/04/18 15:41:59 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import router from "./main.js";

const users = [
    { username: 'user1', password: 'pass1' },
    { username: 'user2', password: 'pass2' },
    { username: 'user3', password: 'pass3' }
];

function login(username, password)
{
    const user = users.find(user => user.username === username && user.password === password);
	const navBarDiv = document.getElementById('login-navbar');
    if (user)
    {
        // Generar un token ficticio
        const token = btoa(username + ':' + password);
        localStorage.setItem('userToken', token);
        return true;
    }
    else
    {
        return false;
    }
}

function isLoggedIn()
{
    return localStorage.getItem('userToken') ? true : false;
}

function logout()
{
    localStorage.removeItem('userToken');
	router.route('/home');
}

function getUsernameFromToken() {
    const token = localStorage.getItem('userToken');
    if (!token) return null;

    const decoded = atob(token);
    return decoded.split(':')[0];
}

export { login, isLoggedIn, logout, getUsernameFromToken };
