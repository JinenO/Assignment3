<?php
// Database connection details
$host = "sql102.infinityfree.com";
$dbname = "if0_38001712_MobileAsg3";
$username = "if0_38001712";
$password = "Infinity329";

// Establish a database connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check for connection errors
if ($conn->connect_error) {
    displayError("Connection failed: " . $conn->connect_error);
    exit;
}

// Get data from POST request
$newPassword = $_POST['newPassword'] ?? '';
$confirmPassword = $_POST['confirmPassword'] ?? '';
$emailOrUsername = $_POST['emailOrUsername'] ?? ''; // Get email/username to identify the user

// Validate passwords
if (empty($newPassword) || empty($confirmPassword)) {
    displayError("Password fields cannot be empty!");
    exit;
}

if ($newPassword !== $confirmPassword) {
    displayError("Passwords do not match!");
    exit;
}

// Hash the new password
$newPasswordHash = password_hash($newPassword, PASSWORD_BCRYPT);

// Update the password in the database
$query = "UPDATE UserInfo SET PasswordHash = ? WHERE (Email = ? OR Username = ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("sss", $newPasswordHash, $emailOrUsername, $emailOrUsername);

if ($stmt->execute()) {
    // Redirect to login page after successful password reset
    header("Location: ../login.html");
    exit;
} else {
    displayError("Error resetting password.");
}

$stmt->close();
$conn->close();

// Function to display error message in HTML
function displayError($message)
{
    echo "
    <!DOCTYPE html>
    <html lang='en'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Password Reset Error</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f8f8f8;
                text-align: center;
                padding: 50px;
            }
            .error-container {
                background-color: #fff;
                border: 1px solid #ddd;
                border-radius: 10px;
                padding: 20px;
                max-width: 400px;
                margin: auto;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            h1 {
                color: #e74c3c;
            }
            p {
                color: #333;
            }
            .back-button {
                display: inline-block;
                margin-top: 20px;
                padding: 10px 20px;
                background-color: #3498db;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
            }
            .back-button:hover {
                background-color: #2980b9;
            }
        </style>
    </head>
    <body>
        <div class='error-container'>
            <h1>Error</h1>
            <p>$message</p>
            <a href='../forgot-password.html' class='back-button'>Back to Forgot Password</a>
        </div>
    </body>
    </html>
    ";
}
?>