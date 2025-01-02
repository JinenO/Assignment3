document.getElementById('signin-form').addEventListener('submit', function (e) {
    const password = document.getElementById('password').value;

    if (password.length < 8) {
        alert('Password must be at least 8 characters long.');
        e.preventDefault();
    }
});
