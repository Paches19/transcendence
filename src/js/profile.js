/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   profile.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/08 11:49:18 by adpachec          #+#    #+#             */
/*   Updated: 2024/04/10 11:37:46 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// Simulación de petición Fetch para obtener datos del perfil del usuario
/*
fetch('/api/user/profile', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('userToken')}`
    }
})
.then(response => response.json())
.then(data => {
    console.log(data);
    // Actualizar el DOM con los datos recibidos
})
.catch(error => console.error('Error:', error));
*/

function loadProfile() {
	const profileHTML = `
		<div class="container mt-4">
			<div class="row">
				<div class="col-12 col-md-4 mb-3">
					<div class="card">
						<img src="path_to_avatar.jpg" class="card-img-top" alt="Avatar del usuario">
						<div class="card-body">
							<h5 class="card-title">Nombre de Usuario</h5>
							<p class="card-text">Aquí iría la información del perfil del usuario.</p>
							<a href="#" class="btn btn-primary">Editar Perfil</a>
						</div>
					</div>
				</div>
				<div class="col-12 col-md-8">
					<div class="card mb-3">
						<div class="card-body">
							<h5 class="card-title">Estadísticas</h5>
							<p class="card-text">Aquí irían las estadísticas del usuario.</p>
						</div>
					</div>
					<div class="card">
						<div class="card-body">
							<h5 class="card-title">Historial de Partidos</h5>
							<p class="card-text">Aquí iría el historial de partidos del usuario.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	`;

	document.getElementById('main-content').innerHTML = profileHTML;
}

export default loadProfile;