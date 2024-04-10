/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/04 14:24:45 by adpachec          #+#    #+#             */
/*   Updated: 2024/04/10 16:57:45 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import Router from './router.js';
import loadProfile from './profile.js';
import play from './play.js';
import loadTournaments from './tournaments.js';
import login from './login.js';
import register from './register.js';
import loadPageNotFound from './pageNotFound.js';
import loadInitialContent from './init.js'

const router = new Router();

router.addRoute('', loadInitialContent);
router.addRoute('home', loadInitialContent);
router.addRoute('profile', loadProfile);
router.addRoute('play', play);
router.addRoute('tournaments', loadTournaments);
router.addRoute('login', login);
router.addRoute('register', register);

router.setDefaultRoute(loadPageNotFound);

document.addEventListener('DOMContentLoaded', () => {
	document.body.addEventListener('click', (e) => {
		const target = e.target.closest('.nav-link, .btn, .logo');
		if (target) {
			e.preventDefault();
			const path = target.getAttribute('href').substring(1);
			router.route(path);
		}
	});
});

export default router;
