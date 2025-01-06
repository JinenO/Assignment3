document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const forgotPasswordLink = document.querySelector(".extra-links a[href='forgot-password.html']");
    const togglePassword = document.getElementById("togglePassword");

    // Password visibility toggle
    togglePassword.addEventListener("click", function () {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        togglePassword.textContent = type === "password" ? "👁️" : "👁️‍🗨️";
    });

    // Handle form submission
    loginForm.addEventListener("submit", (event) => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        let valid = true;

        // Clear previous error messages
        clearErrorMessages();

        // Validate email
        if (!validateEmail(email)) {
            showError(emailInput, "Please enter a valid email address.");
            valid = false;
        }

        // Validate password
        if (password.length < 8) {
            showError(passwordInput, "Password must be at least 8 characters long.");
            valid = false;
        }

        // If any validation fails, prevent form submission
        if (!valid) {
            event.preventDefault();
        }
    });

    // Handle "Forgot Password?" click
    forgotPasswordLink.addEventListener("click", (event) => {
        const confirmReset = confirm("Are you sure you want to reset your password? You will be redirected to the password recovery page.");
        if (!confirmReset) {
            event.preventDefault();
        }
    });

    // Helper function: Validate email format
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Helper function: Show error message
    function showError(inputElement, message) {
        // Remove any existing error for this input
        clearErrorForInput(inputElement);

        const error = document.createElement("p");
        error.className = "error-message";
        error.style.cssText = `
            color: #e74c3c;
            font-size: 12px;
            margin-top: 5px;
            margin-bottom: 0;
            transition: all 0.3s ease;
        `;
        error.textContent = message;

        // Add a subtle animation
        error.style.opacity = "0";
        inputElement.parentElement.appendChild(error);

        // Trigger animation
        setTimeout(() => {
            error.style.opacity = "1";
        }, 10);

        // Add error styling to the input
        inputElement.style.borderColor = "#e74c3c";
        inputElement.style.backgroundColor = "#fff8f8";
    }

    // Helper function: Clear error for specific input
    function clearErrorForInput(inputElement) {
        const parent = inputElement.parentElement;
        const existingError = parent.querySelector(".error-message");
        if (existingError) {
            existingError.remove();
        }
        // Reset input styling
        inputElement.style.borderColor = "";
        inputElement.style.backgroundColor = "";
    }

    // Helper function: Clear all error messages
    function clearErrorMessages() {
        const errors = document.querySelectorAll(".error-message");
        errors.forEach((error) => error.remove());

        // Reset all inputs styling
        const inputs = document.querySelectorAll("input");
        inputs.forEach(input => {
            input.style.borderColor = "";
            input.style.backgroundColor = "";
        });
    }

    // Add input event listeners for real-time validation
    emailInput.addEventListener("input", () => {
        if (emailInput.value.trim()) {
            clearErrorForInput(emailInput);
            if (!validateEmail(emailInput.value.trim())) {
                showError(emailInput, "Please enter a valid email address.");
            }
        }
    });

    passwordInput.addEventListener("input", () => {
        if (passwordInput.value.trim()) {
            clearErrorForInput(passwordInput);
            if (passwordInput.value.trim().length < 8) {
                showError(passwordInput, "Password must be at least 8 characters long.");
            }
        }
    });
<<<<<<< HEAD
});
=======
});
>>>>>>> behAss3
