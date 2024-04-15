/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   register.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 12:22:20 by adpachec          #+#    #+#             */
/*   Updated: 2024/04/15 12:07:56 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import router from './main.js';

function setupRegisterForm()
{
    document.getElementById('main-content').innerHTML = `
        <div class="register-container">
            <h2>Create Your Account</h2>
            <form id="register-form" class="register-form">
                <input type="text" id="register-username" placeholder="Username" required>
                <input type="password" id="register-password" placeholder="Password" required>
                <button type="submit" class="btn btn-primary">Register</button>
            </form>
            <div id="error-message" display: none;"></div>
        </div>
    `;
    
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', handleRegisterSubmit);
}

function handleRegisterSubmit(event)
{
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    const errorMessage = validateInputs(username, password);
    if (errorMessage)
	{
        displayError(errorMessage);
    }
	else
	{
        console.log('Registering', username, password);
        alert('Registration successful for ' + username);
        
        router.route('home');
    }
}

function validateInputs(username, password)
{
    if (username.length < 2)
	{
        return 'Your username must be at least 2 characters long.';
    }

    if (password.length < 4)
	{
        return 'Your password must be at least 4 characters long.';
    }
	
    return null;
}

function displayError(message)
{
    document.getElementById('error-message').innerHTML = ` 
		${message}
	`;
    document.getElementById('error-message').style.display = 'block';
}

export default setupRegisterForm;