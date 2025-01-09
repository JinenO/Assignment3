// Fetch user data from profile.php
fetch('https://jinen.infinityfreeapp.com/www/server/profile.php')
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
            window.location.href = 'login.html';
        } else {
            document.getElementById('welcomeMessage').innerText = `Welcome, ${data.Username}!`;
            document.getElementById('username').innerText = data.Username;
            document.getElementById('currentLocation').innerText = data.CurrentLocation || 'Not set';
            document.getElementById('birthday').innerText = data.Birthday;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to load profile data.');
    });

// Function to toggle Birthday edit field
function toggleBirthdayEdit() {
    document.getElementById('birthday').style.display = 'none';
    document.getElementById('birthdayInput').style.display = 'inline-block';
    document.getElementById('editBirthdayBtn').style.display = 'none';
    document.getElementById('saveBirthdayBtn').style.display = 'inline-block';
}

// Function to toggle Location edit field
function toggleLocationEdit() {
    document.getElementById('currentLocation').style.display = 'none';
    document.getElementById('locationInput').style.display = 'inline-block';
    document.getElementById('locationInput').value = document.getElementById('currentLocation').innerText;
    document.getElementById('editLocationBtn').style.display = 'none';
    document.getElementById('saveLocationBtn').style.display = 'inline-block';
}

// Function to save updated Location
function saveLocation() {
    const newLocation = document.getElementById('locationInput').value;
    if (newLocation) {
        fetch('https://jinen.infinityfreeapp.com/www/server/edit_profile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `field=CurrentLocation&new_value=${encodeURIComponent(newLocation)}`,
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Location updated successfully!');
                    window.location.reload();
                } else {
                    alert('Failed to update location.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error updating location.');
            });
    }
}

// Function to save updated Birthday
function saveBirthday() {
    const newBirthday = document.getElementById('birthdayInput').value;
    if (newBirthday) {
        fetch('https://jinen.infinityfreeapp.com/www/server/edit_profile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `field=Birthday&new_value=${newBirthday}`,
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Birthday updated successfully!');
                    window.location.reload();
                } else {
                    alert('Failed to update birthday.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error updating birthday.');
            });
    }
}

// Logout function
function logout() {
    fetch('https://jinen.infinityfreeapp.com/www/server/logout.php')
        .then(response => response.json()) // Expect a JSON response
        .then(data => {
            if (data.success) {
                window.location.href = 'login.html';
            } else {
                alert('Failed to log out.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to log out.');
        });
}
