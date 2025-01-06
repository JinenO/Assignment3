document.getElementById('validateButton').addEventListener('click', function () {
    // Collect form data
    var emailOrUsername = document.getElementById('emailOrUsername').value;
    var birthday = document.getElementById('birthday').value;

    if (emailOrUsername === "" || birthday === "") {
        alert("Email/Username and Birthday are required.");
        return;
    }

    // Send data to the server using fetch (AJAX)
    fetch('server/validate-user.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            emailOrUsername: emailOrUsername,
            birthday: birthday
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Show password reset section if validation is successful
                document.getElementById('resetPasswordSection').style.display = 'block';
                alert('User validated. You can now reset your password.');
            } else {
                alert(data.message); // Show the message from the server
            }
        })
        .catch(error => {
            alert('An error occurred: ' + error.message);
        });
});

document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function () {
        var targetInput = document.getElementById(this.getAttribute('data-target'));
        if (targetInput.type === 'password') {
            targetInput.type = 'text';
            this.textContent = '🙈'; // Change icon to closed eye
        } else {
            targetInput.type = 'password';
            this.textContent = '👁️'; // Change icon to open eye
        }
    });
<<<<<<< HEAD
});
=======
});
>>>>>>> behAss3
