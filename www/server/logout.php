<?php
// Start the session
session_start();

// Check if the user is logged in
if (!isset($_SESSION['CustomerID'])) {
    echo json_encode(["success" => false, "error" => "User not logged in."]);
    exit;
}

// Database connection details
$host = "sql102.infinityfree.com";
$dbname = "if0_38001712_MobileAsg3";
$username = "if0_38001712";
$password = "Infinity329";

// Establish a database connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check for connection errors
if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Set timezone to Malaysia (UTC+8)
date_default_timezone_set('Asia/Kuala_Lumpur');

// Get the logged-in username
$username = $_SESSION['Username'];

// Log the logout activity
$log_stmt = $conn->prepare("INSERT INTO LogInteraction (Username, Api, UserActivity, LogTime) VALUES (?, 'none', 'logout', ?)");
$current_time = date('Y-m-d H:i:s'); // Current Malaysia time
$log_stmt->bind_param("ss", $username, $current_time);

if ($log_stmt->execute()) {
    // Logout successful: Unset session variables and destroy the session
    session_unset();
    session_destroy();

    // Return a JSON success response
    echo json_encode(["success" => true]);
} else {
    // Handle errors during logging
    echo json_encode(["success" => false, "error" => "Failed to record logout activity."]);
}

// Close the statement and connection
$log_stmt->close();
$conn->close();
?>