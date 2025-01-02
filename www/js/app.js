// Show pages for login, sign-up, and forgot password
function showLoginPage() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
}

function showSignUpPage() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('signUpSection').style.display = 'block';
}

function showForgotPasswordPage() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('forgotPasswordSection').style.display = 'block';
}

// Login functionality
function loginUser() {
    var email = $('#loginEmail').val();
    var password = $('#loginPassword').val();

    if (email && password) {
        $.ajax({
            url: 'login.php',
            type: 'POST',
            data: { email: email, password: password },
            success: function(response) {
                if (response === "Success") {
                    $('#loginSection').hide();
                    $('#mainPage').show();
                    alert("Login Successful!");
                } else {
                    alert("Invalid credentials. Please try again.");
                }
            }
        });
    }
}

// Sign Up functionality
function signUpUser() {
    var email = $('#signUpEmail').val();
    var password = $('#signUpPassword').val();

    if (email && password) {
        $.ajax({
            url: 'signUp.php',
            type: 'POST',
            data: { email: email, password: password },
            success: function(response) {
                if (response === "Success") {
                    $('#signUpSection').hide();
                    $('#mainPage').show();
                    alert("Sign Up Successful!");
                } else {
                    alert("Error signing up. Please try again.");
                }
            }
        });
    }
}

// Forgot Password functionality
function resetPassword() {
    var email = $('#forgotEmail').val();

    if (email) {
        $.ajax({
            url: 'forgotPassword.php',
            type: 'POST',
            data: { email: email },
            success: function(response) {
                alert(response);
                $('#forgotPasswordSection').hide();
                $('#loginPage').show();
            }
        });
    }
}

// API Interaction (Weather, News, Social Media)
function fetchWeather() {
    $.ajax({
        url: 'weather.php',
        type: 'GET',
        success: function(response) {
            $('#weatherResult').html(response);
        }
    });
}

function fetchNews() {
    $.ajax({
        url: 'news.php',
        type: 'GET',
        success: function(response) {
            $('#newsResult').html(response);
        }
    });
}

function fetchSocialMedia() {
    $.ajax({
        url: 'socialmedia.php',
        type: 'GET',
        success: function(response) {
            $('#socialMediaResult').html(response);
        }
    });
}
