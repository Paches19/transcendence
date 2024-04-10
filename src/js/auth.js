/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   auth.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/10 11:27:22 by adpachec          #+#    #+#             */
/*   Updated: 2024/04/10 13:44:42 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const users = [
    { username: 'user1', password: 'pass1' },
    { username: 'user2', password: 'pass2' },
    { username: 'user3', password: 'pass3' }
];

function login(username, password) {
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        // Generar un token ficticio
        const token = btoa(username + ':' + password);
        localStorage.setItem('userToken', token);
        alert('Login exitoso');
        return true;
    } else {
        alert('Login fallido');
        return false;
    }
}

function isLoggedIn() {
    return localStorage.getItem('userToken') ? true : false;
}

function logout() {
    localStorage.removeItem('userToken');
    alert('Sesión cerrada');
	window.location.hash = '#home';
}

export { login, isLoggedIn, logout };
