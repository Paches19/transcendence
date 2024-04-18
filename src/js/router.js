/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   router.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 11:51:47 by adpachec          #+#    #+#             */
/*   Updated: 2024/04/18 12:46:40 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export default class Router {
	constructor()
	{
		this.routes = {};
		this.defaultRoute = () => console.error("Esta ruta no existe.");
	}

	addRoute(path, action)
	{
		this.routes[path] = action;
	}

	setDefaultRoute(action)
	{
		this.defaultRoute = action;
	}

	route(path)
	{
		if (path in this.routes)
		{
			this.routes[path]();
		}
		else
		{
			this.defaultRoute();
		}
	}
}


