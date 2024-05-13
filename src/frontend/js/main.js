/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/04 14:24:45 by adpachec          #+#    #+#             */
/*   Updated: 2024/05/07 16:28:13 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import Router from './router.js';
import loadProfile from './profile.js';
import loadEditProfile from './editProfile.js';
import initPlayPage from './play.js';
import { loadTournaments } from './tournaments.js';
import loadTournamentDetails from './tournamentDetails.js';
import login from './login.js';
import setupRegisterForm from './register.js';
import loadPageNotFound from './pageNotFound.js';
import loadInitialContent from './init.js'
import { logout } from './auth.js';
import updateNavbar from './navbar.js';

const router = new Router();

router.addRoute('/', loadInitialContent);
router.addRoute('/home', loadInitialContent);
router.addRoute('/profile', loadProfile);
router.addRoute('/edit-profile', loadEditProfile);
router.addRoute('/play', initPlayPage);
router.addRoute('/tournaments', loadTournaments);
router.addRoute('/login', login);
router.addRoute('/register', setupRegisterForm);
router.addRoute('/tournaments/:id', id => {
    const tournaments = 0;
    try {
        tournaments = fetchTournaments();
        updateTournamentHTML(tournaments);
    } catch (error) {
        console.error('Error loading tournaments:', error);
    }
    const tournament = tournaments.find(t => t.id === parseInt(id));
    if (tournament) {
        loadTournamentDetails(tournament);
    } else {
        loadPageNotFound();
    }
});
router.setDefaultRoute(loadPageNotFound);

async function fetchTournaments() {
    const apiUrl = 'http://localhost:8000/api/tournaments';
    return fetch(apiUrl, {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) {
                console.error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching tournaments:', error);
            return [];
        });
}

document.addEventListener('DOMContentLoaded', () =>
{
	router.resolveCurrentPath();
	
	document.body.addEventListener('click', async function(event) {
		const target = event.target.closest('[data-route]');
		if (target) {
			event.preventDefault();
			const path = target.dataset.route;
			router.route(path);
		}
        
        if (event.target.closest('#link-logout')) {
            event.preventDefault();
            try {
                await logout();
                updateNavbar();
                router.route('/home');
            } catch (error) {
                console.error('Failed to log out:', error);
            }
        }
	});
	
	const userInfo = document.getElementById('user-info');
	if (userInfo)
	{
		userInfo.addEventListener('click', (e) =>
		{
			e.preventDefault();
		});
	}
});

export default router;
