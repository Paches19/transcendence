/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   login.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 12:21:53 by adpachec          #+#    #+#             */
/*   Updated: 2024/05/07 10:10:29 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { login } from './auth.js';
import updateNavbar from "./navbar.js";
import router from './main.js';

function setupLoginEvent() {
    const loginButton = document.getElementById('login-btn');
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
        
            login(username, password).then(isSuccessful => {
                if (isSuccessful) {
                    updateNavbar();
                    const loginMsg = document.getElementById('login-msg');
                    if (loginMsg) {
                        loginMsg.innerText = 'You have logged in! Ready to rack up some points?';
                    }
                    setTimeout(() => {
                            router.route('/profile');
                    }, 1500);
                } else {
                    const loginMsg = document.getElementById('login-msg');
                    if (loginMsg) {
                        loginMsg.innerText = 'Hmm, that username and password don´t seem to match.';
                    }
                }
            }).catch(error => {
                console.error('Login error:', error);
                const loginMsg = document.getElementById('login-msg');
                if (loginMsg) {
                    loginMsg.innerText = 'Error during login process.';
                }
            });
        });
    } else {
        console.error('Login button not found!');
    }
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
                            <button type="button" class="flip-card__btn" id="login-btn">Let's go!</button>
                            <div class="text" id="login-msg"> </div>
                        </form>
                </div>
            </div>   
        </div>
    `;
    
    if (document.readyState === 'loading') { 
        document.addEventListener('DOMContentLoaded', setupLoginEvent);
    } else {
        setupLoginEvent();
    }
}

export default loadLogin;