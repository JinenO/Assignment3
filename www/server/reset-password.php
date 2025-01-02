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
    die("Connection failed: " . $conn->connect_error);
}

// Get data from POST request
$newPassword = $_POST['newPassword'] ?? '';
$confirmPassword = $_POST['confirmPassword'] ?? '';
$emailOrUsername = $_POST['emailOrUsername'] ?? ''; // Get email/username to identify the user

// Validate passwords
if (empty($newPassword) || empty($confirmPassword)) {
    echo "Password fields cannot be empty!";
    exit;
}

if ($newPassword !== $confirmPassword) {
    echo "Passwords do not match!";
    exit;
}

// Hash the new password
$newPasswordHash = password_hash($newPassword, PASSWORD_BCRYPT);

// Update the password in the database
$query = "UPDATE Info SET PasswordHash = ? WHERE (Email = ? OR Username = ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("sss", $newPasswordHash, $emailOrUsername, $emailOrUsername);
if ($stmt->execute()) {
    // Redirect to login page after successful password reset
    header("Location: login.html"); // Redirect user to login page
    exit(); // Ensure no further output is sent after the header
} else {
    echo "Error resetting password.";
}

$stmt->close();
$conn->close();
?>