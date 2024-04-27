/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   editProfile.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/27 13:04:35 by adpachec          #+#    #+#             */
/*   Updated: 2024/04/27 16:43:32 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { isLoggedIn } from './auth.js';
import router from './main.js';

const mockUser =
	{
		username: "user1",
		password: "pass1",
		avatar: "./images/avatar/author_1.png",
		gamesPlayed: 150,
		gamesWon: 100,
		gamesLost: 50,
		pointsFor: 1200,
		pointsAgainst: 800,
		tournamentsPlayed: 10,
		tournamentsWon: 5,
		matchHistory:
		[
			{ date: "04/07/2024", opponent: "Player42", result: "Win", score: "21-15" },
			{ date: "04/09/2024", opponent: "ArcadeMaster", result: "Loss", score: "18-21" },
			{ date: "04/12/2024", opponent: "PixelNinja", result: "Win", score: "21-10" }
		]
	};

function loadEditProfile() {
	if (!isLoggedIn()) {
	  localStorage.setItem('loginRedirect', 'true');
	  router.route('/login');
	  return;
	}

	const currentUser = mockUser;
  
	const editProfileHTML = `
	  <div class="container mt-5">
		<div class="row">
		  <div class="col-md-6 offset-md-3">
			<div class="card">
			  <div class="card-header">
				Edit Profile
			  </div>
			  <div class="card-body">
				<form id="edit-profile-form">
				  <div class="form-group">
					<label for="profile-name">Name</label>
					<input type="text" class="form-control" id="profile-name" value="${currentUser.username}" required>
					<label for="profile-name">Password</label>
					<input type="password" class="form-control" id="profile-password" value="${currentUser.password}" required>
				  </div>
				  <div class="form-group">
					<label for="profile-picture">Profile Picture URL</label>
					<input type="file" class="form-control-file" id="profile-picture-upload" accept="image/*">
					<img id="profile-picture-preview" src="${currentUser.avatar}" alt="Profile Picture Preview" class="img-thumbnail" style="margin-top: 10px; max-width: 200px;">
				  </div>
				  <button type="button" class="btn btn-secondary" id="upload-picture">Upload Picture</button>
				  <button type="button" class="btn btn-primary" id="save-profile">Save</button>
				</form>
			  </div>
			</div>
		  </div>
		</div>
	  </div>
	`;
  
	// Se inserta el HTML en el contenedor principal de la SPA.
	document.getElementById('main-content').innerHTML = editProfileHTML;
	addEditProfileEventListeners();
  }
  
  function addEditProfileEventListeners() {
	document.getElementById('save-profile').addEventListener('click', function() {
	  // Aquí se recogerían los nuevos valores del formulario.
	  const name = document.getElementById('profile-name').value;
	  const password = document.getElementById('profile-password').value;
	  const pictureUrl = document.getElementById('profile-picture').value;
  
	  // Aquí se realizaría la llamada a la API para guardar los cambios del perfil.
	  console.log('Saving profile...');
	  console.log('Name:', name);
	  console.log('Password:', password);
	  console.log('Profile Picture URL:', pictureUrl);
  
	  // Suponiendo que se tenga una función 'updateUserProfile' para actualizar los datos del perfil.
	  updateUserProfile(name, password, pictureUrl);
	});

	document.getElementById('profile-picture-upload').addEventListener('change', function() {
		const file = this.files[0];
		if (file) {
		  const reader = new FileReader();
		  reader.onload = function(e) {
			const preview = document.getElementById('profile-picture-preview');
			preview.src = e.target.result;
			preview.alt = 'Selected Profile Picture';
		  };
		  reader.readAsDataURL(file);
		}
	  });
	  
	  document.getElementById('upload-picture').addEventListener('click', function() {
		// Aquí implementarías la carga al servidor
		const fileInput = document.getElementById('profile-picture-upload');
		const file = fileInput.files[0];
		if (file) {
		  console.log('Uploading picture...');
		  showNotification("Photo uploaded");
		  // Aquí va el código para cargar la imagen al servidor
		  // Puedes utilizar FormData y un XMLHttpRequest o fetch para esto
		} else {
		  alert('Please select a picture first.');
		}
	  });
  }

  function showNotification(message) {
	let notification = document.getElementById('notification');
	if (!notification)
	{
		notification = document.createElement('div');
		notification.id = 'notification';
		notification.className = 'notification';
		document.body.appendChild(notification);
	}
	notification.textContent = message;
	
	notification.classList.add('show');
	setTimeout(() =>
	{
		notification.classList.remove('show');
	}, 4000);
  }
  
  function updateUserProfile(name, password, pictureUrl) {
	console.log(`Updating profile for ${mockUser.username}`);
	console.log(`New name: ${name}`);
	console.log(`New password: ${password}`);
	console.log(`New profile picture URL: ${pictureUrl}`);
  
	// Simular actualización de los datos del perfil.
	mockUser.username = name;
	mockUser.password = password;
	mockUser.avatar = pictureUrl;
  
	// Mostrar alguna notificación al usuario de que el perfil se ha actualizado correctamente.
	showNotification('Profile updated successfully.');
  }
  
  export default loadEditProfile;