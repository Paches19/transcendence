/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/04 14:24:45 by adpachec          #+#    #+#             */
/*   Updated: 2024/04/22 18:08:37 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import Router from './router.js';
import loadProfile from './profile.js';
import initPlayPage from './play.js';
import { loadTournaments } from './tournaments.js';
import loadTournamentDetails from './tournamentDetails.js';
import login from './login.js';
import setupRegisterForm from './register.js';
import loadPageNotFound from './pageNotFound.js';
import loadInitialContent from './init.js'
import { logout } from './auth.js';
import updateNavbar from './navbar.js';

const mockTournaments = [
    {
        id: 1,
        name: 'Spring Pong Championship',
        participants: ['Player1', 'Player2', 'Player3'],
        status: 'Upcoming'
    },
    {
        id: 2,
        name: 'Summer Pong Fest',
        participants: ['Player4', 'Player5', 'Player6', 'Player4', 'Player5', 'Player6', 'Player4', 'Player5', 'Player6', 'Player4', 'Player5', 'Player6', 'Player4', 'Player5', 'Player6', 'Player4', 'Player5', 'Player6'],
        status: 'In Progress'
    },
	{
        id: 3,
        name: 'Spring Pong Championship',
        participants: ['Player1', 'Player2', 'Player3'],
        status: 'Upcoming'
    },
    {
        id: 4,
        name: 'Summer Pong Fest',
        participants: ['Player4', 'Player5', 'Player6'],
        status: 'In Progress'
    },
	{
        id: 5,
        name: 'Spring Pong Championship',
        participants: ['Player1', 'Player2', 'Player3'],
        status: 'Upcoming'
    },
    {
        id: 6,
        name: 'Summer Pong Fest',
        participants: ['Player4', 'Player5', 'Player6'],
        status: 'Ended'
    }
];

const router = new Router();

router.addRoute('/', loadInitialContent);
router.addRoute('/home', loadInitialContent);
router.addRoute('/profile', loadProfile);
router.addRoute('/play', initPlayPage);
router.addRoute('/tournaments', loadTournaments);
router.addRoute('/login', login);
router.addRoute('/register', setupRegisterForm);
router.addRoute('/tournaments/:id', id => {
    const tournament = mockTournaments.find(t => t.id === parseInt(id));
    if (tournament) {
        loadTournamentDetails(tournament);
    } else {
        loadPageNotFound();
    }
});
router.setDefaultRoute(loadPageNotFound);

document.addEventListener('DOMContentLoaded', () =>
{
	router.resolveCurrentPath();
	
	document.body.addEventListener('click', function(event) {
		const target = event.target.closest('[data-route]');
		if (target) {
			event.preventDefault();
			const path = target.dataset.route;
			router.route(path);
		}
        
        if (event.target.closest('#link-logout')) {
            event.preventDefault();
            logout();
            updateNavbar();
            router.route('/home');
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
