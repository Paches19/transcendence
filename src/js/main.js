/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/04 14:24:45 by adpachec          #+#    #+#             */
/*   Updated: 2024/04/16 17:27:55 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import Router from './router.js';
import loadProfile from './profile.js';
import play from './play.js';
import { loadTournaments } from './tournaments.js';
import login from './login.js';
import setupRegisterForm from './register.js';
import loadPageNotFound from './pageNotFound.js';
import loadInitialContent from './init.js'
import { logout } from './auth.js';
import updateNavbar from './navbar.js';

const router = new Router();

router.addRoute('', loadInitialContent);
router.addRoute('home', loadInitialContent);
router.addRoute('profile', loadProfile);
router.addRoute('play', play);
router.addRoute('tournaments', loadTournaments);
router.addRoute('login', login);
router.addRoute('register', setupRegisterForm);

router.setDefaultRoute(loadPageNotFound);

document.addEventListener('DOMContentLoaded', () =>
{
	document.body.addEventListener('click', (e) =>
	{
		const target = e.target.closest('.nav-link, .btn, .logo');
		if (target && target.hasAttribute('href'))
		{
			e.preventDefault();
			const path = target.getAttribute('href').substring(1);
			router.route(path);
		}
		
		const logoutLink = document.getElementById('link-logout');
		if (logoutLink)
		{
			logoutLink.addEventListener('click', (e) =>
			{
				e.preventDefault();
				logout();
				updateNavbar();
				router.route('home');
			});
		}
		
		const userInfo = document.getElementById('user-info');
		if (userInfo)
		{
			userInfo.addEventListener('click', (e) =>
			{
				e.preventDefault();
			});
		}
	});
});

export default router;
