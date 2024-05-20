/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   login.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 12:21:53 by adpachec          #+#    #+#             */
/*   Updated: 2024/05/20 11:09:15 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { login } from './auth.js';
import updateNavbar from "./navbar.js";
import router from './main.js';

function handleLoginSubmit() {
    const loginButton = document.getElementById('login-btn');
    loginButton.addEventListener('submit', setupLoginEvent);
}

async function setupLoginEvent(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    login(username, password).then(isSuccessful => {
        const loginMsg = document.getElementById('login-msg');
        if (isSuccessful) {
            updateNavbar();
            if (loginMsg) {
                loginMsg.innerText = 'You have logged in! Ready to rack up some points?';
                loginMsg.classList.remove('error-msg');
                loginMsg.classList.add('success-msg');
            }
            setTimeout(() => {
                    router.route('/profile');
            }, 2000);
        } else {
            if (loginMsg) {
                loginMsg.innerText = 'Hmm, that username and password don´t seem to match.';
                loginMsg.classList.remove('success-msg');
                loginMsg.classList.add('error-msg');
            }
        }
    }).catch(error => {
        console.error('Login error:', error);
        if (loginMsg) {
            loginMsg.innerText = 'Error during login process.';
            loginMsg.classList.remove('success-msg');
            loginMsg.classList.add('error-msg');
        }
    });
}

function loadLogin() {
    document.getElementById('main-content').innerHTML = `
        <div class="wrapper">
            <div class="flip-card__inner">
                <div class="flip-card__front">
                    <div class="title">Log in</div>
                        <form action="" class="flip-card__form">
                            <input type="text" placeholder="Name" id="username" class="flip-card__input">
                            <input type="password" placeholder="Password" id="password" class="flip-card__input">
                            <button type="submit" class="flip-card__btn" id="login-btn">Let's go!</button>
                            <div class="text" id="login-msg"> </div>
                        </form>
                </div>
            </div>   
        </div>
    `;
    
    if (document.readyState === 'loading') { 
        document.addEventListener('DOMContentLoaded', handleLoginSubmit);
    } else {
        handleLoginSubmit();
    }
}

export default loadLogin;