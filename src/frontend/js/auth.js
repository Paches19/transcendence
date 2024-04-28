/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   auth.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/10 11:27:22 by adpachec          #+#    #+#             */
/*   Updated: 2024/04/28 09:58:16 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import router from "./main.js";
import updateNavbar from "./navbar.js";

const users = [
    { username: 'user1', password: 'pass1' },
    { username: 'user2', password: 'pass2' },
    { username: 'user3', password: 'pass3' }
];

function login(username, password)
{
    const user = users.find(user => user.username === username && user.password === password);
    if (user)
    {
        const token = btoa(username + ':' + password);
        localStorage.setItem('userToken', token);
        return true;
    }
    else
    {
        return false;
    }
}

// async function login(username, password) {
//     // Endpoint de la API para el login
//     const loginEndpoint = '/api/auth/login';
    
//     try {
//         // Hacer una petición POST con las credenciales de usuario
//         const response = await fetch(loginEndpoint, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 username: username,
//                 password: password,
//             }),
//         });
        
//         // Verificar si la petición fue exitosa
//         if (response.ok) {
//             // Parsear el cuerpo de la respuesta para obtener el token
//             const data = await response.json();
//             const token = data.token;
            
//             // Guardar el token en localStorage para mantener la sesión
//             localStorage.setItem('userToken', token);
            
//             // Actualizar la interfaz para reflejar el estado de sesión
//             updateNavbar();

//             // Redirigir al usuario a la página principal o perfil
//             router.route('/profile');
            
//             return true;
//         } else {
//             // Manejar errores como credenciales inválidas, etc.
//             throw new Error('Login failed');
//         }
//     } catch (error) {
//         console.error('An error occurred during login:', error);
//         return false;
//     }
// }

function isLoggedIn()
{
    return localStorage.getItem('userToken') ? true : false;
}

function logout()
{
    localStorage.removeItem('userToken');
    updateNavbar();
	router.route('/home');
}

// async function logout() {
//     const logoutEndpoint = 'api/auth/logout';
//     try {
//         const response = await fetch(logoutEndpoint, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${localStorage.getItem('userToken')}`
//             },
//         });

//         if (response.ok) {
//             localStorage.removeItem('userToken');
//             updateNavbar();
//             router.route('/home');
//             console.log('Logged out successfully.');
//         } else {
//             throw new Error('Logout failed');
//         }
//     } catch (error) {
//         console.error('An error occurred during logout:', error);
//     }
// }

function getUsernameFromToken() {
    const token = localStorage.getItem('userToken');
    if (!token)
        return null;

    const decoded = atob(token);
    return decoded.split(':')[0];
}

export { login, isLoggedIn, logout, getUsernameFromToken };
