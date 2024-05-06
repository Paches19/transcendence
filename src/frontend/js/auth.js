/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   auth.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/10 11:27:22 by adpachec          #+#    #+#             */
/*   Updated: 2024/05/06 19:12:47 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import router from "./main.js";
import updateNavbar from "./navbar.js";

async function login(username, password) {
    const loginEndpoint = 'http://localhost:8000/api/auth/login';
    
    try {
        const response = await fetch(loginEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
        });
        
        const data = await response.json();
        
        if (response.ok && data.msg === "Login successful") {
            const token = username;
            localStorage.setItem('userToken', token);
            console.log("token: " + token);
            updateNavbar();
            router.route('/profile');
            return true;
        } else {
            console.log("response KO");
            return false;
        }
    } catch (error) {
        console.error('An error occurred during login:', error);
        return false;
    }
    return false;
}

function isLoggedIn()
{
    return localStorage.getItem('userToken') ? true : false;
}

async function logout() {
    const logoutEndpoint = 'http://localhost:8000/api/auth/logout';
    try {
        const response = await fetch(logoutEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            localStorage.removeItem('userToken');
            updateNavbar();
            router.route('/home');
            console.log('Logged out successfully.');
        }
    } catch (error) {
        console.error('An error occurred during logout:', error);
    }
}

function getUsernameFromToken() {
    const token = localStorage.getItem('userToken');
    if (!token)
        return null;

    const decoded = atob(token);
    return decoded.split(':')[0];
}

export { login, isLoggedIn, logout, getUsernameFromToken };
