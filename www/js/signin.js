document.addEventListener('DOMContentLoaded', function () {
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');

    // Toggle password visibility
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
    });

    // Enhanced password validation
    document.getElementById('signin-form').addEventListener('submit', function (e) {
        const password = passwordInput.value;
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        if (!Object.values(requirements).every(Boolean)) {
            e.preventDefault();
            let message = 'Password must contain:\n';
            if (!requirements.length) message += '- At least 8 characters\n';
            if (!requirements.uppercase) message += '- At least one uppercase letter\n';
            if (!requirements.lowercase) message += '- At least one lowercase letter\n';
            if (!requirements.number) message += '- At least one number\n';
            if (!requirements.special) message += '- At least one special character\n';
            alert(message);
        }
    });
<<<<<<< HEAD
});
=======
});
>>>>>>> behAss3
