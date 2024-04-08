/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   profile.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 11:49:18 by adpachec          #+#    #+#             */
/*   Updated: 2024/04/08 12:07:38 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

function loadProfile() {
	document.getElementById('main-content').innerHTML = `
		<h1>Perfil del Usuario</h1>
		<p>Información del perfil aquí.</p>
	`;
}

export default loadProfile;