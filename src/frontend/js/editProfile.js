/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   editProfile.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/04/27 13:04:35 by adpachec          #+#    #+#             */
/*   Updated: 2024/05/14 12:38:05 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


import { isLoggedIn } from './auth.js';
import router from './main.js';
import updateNavbar from './navbar.js';

async function loadEditProfile() {
    if (!isLoggedIn()) {
        localStorage.setItem('loginRedirect', 'true');
        router.route('/login');
        return;
    }

    const apiUrl = 'http://localhost:8000/api/users';
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const user = await response.json();
        loadHtmlEditProfile(user);
    } catch (error) {
        console.error('Error loading profile:', error);
        router.route("/error");
    }
}
function loadHtmlEditProfile(currentUser) {
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
				  <div class="form-group" id="picture-group">
					<label for="profile-picture">Profile Picture URL</label>
					<input type="file" class="form-control-file" id="profile-picture-upload" accept="image/*">
					<img id="profile-picture-preview" src="http://localhost:8000${currentUser.profilePicture}" alt="Profile Picture Preview" class="img-thumbnail" style="margin-top: 10px; max-width: 200px;">
				  </div>
				  <div class="button-container">
					<button type="button" class="btn btn-secondary" id="upload-picture"><span>Upload<br>Picture</span></button>
					<button type="button" class="btn btn-primary" id="save-profile">Save</button>
				  </div>
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
	  const password = document.getElementById('profile-password').value;
	  if (!password)
			password = "pass123";
	  const username = document.getElementById('profile-name').value;
	  updateUserProfile(username, password);
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
		const fileInput = document.getElementById('profile-picture-upload');
		const file = fileInput.files[0];
		if (file) {
		  updateUserAvatar(file);
		} else {
			showNotification("Please select a photo first!!");
		}
	  });
  }
  
  function updateUserAvatar(file) {
    const apiUrl = 'http://localhost:8000/api/users/avatar';
    const formData = new FormData();
    formData.append('file', file);

    const requestOptions = {
        method: 'POST',  
        body: formData,
		credentials: 'include'
    };

    fetch(apiUrl, requestOptions)
        .then(response => {
            if (!response.ok) {
				showNotification('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            console.log('Success:', data);
            showNotification("Photo uploaded successfully.");
			updateNavbar();
        })
        .catch((error) => {
            console.error('Error:', error); 
            showNotification("Error uploading photo: " + error.message);
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
  
  function updateUserProfile(newUsername, newPassword) {
    const apiUrl = 'http://localhost:8000/api/users/update';
    const requestBody = {
		username: newUsername,
        password: newPassword, 
    };

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
		credentials: 'include'
    };

    fetch(apiUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
			showNotification('Profile updated successfully.');
			updateNavbar();
        })
        .catch((error) => {
            console.error('Error:', error);
			showNotification('Error: ' + error);
        });
	}
  
  export default loadEditProfile;