// Add event listeners when the DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const forgotPasswordLink = document.querySelector(".extra-links a[href='forgot-password.html']");

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
        const error = document.createElement("p");
        error.className = "error-message";
        error.style.color = "red";
        error.style.marginTop = "5px";
        error.textContent = message;
        inputElement.insertAdjacentElement("afterend", error);
    }

    // Helper function: Clear all error messages
    function clearErrorMessages() {
        const errors = document.querySelectorAll(".error-message");
        errors.forEach((error) => error.remove());
    }
});
