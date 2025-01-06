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

// Set timezone to Malaysia (UTC+8)
date_default_timezone_set('Asia/Kuala_Lumpur');

// Start a session to get the logged-in user's details
session_start();

// Check if the user is logged in
if (!isset($_SESSION['Username'])) {
    echo json_encode(['success' => false, 'error' => 'User not logged in']);
    exit;
}

// Get the search details from the POST request
$data = json_decode(file_get_contents('php://input'), true);
$searchTerm = isset($data['searchTerm']) ? $data['searchTerm'] : 'Unknown search';
$dataType = isset($data['dataType']) ? $data['dataType'] : 'Unknown type';

// Get the username from the session
$username = $_SESSION['Username'];

// Prepare and execute the insert query
$log_stmt = $conn->prepare("INSERT INTO LogInteraction (Username, Api, UserActivity, LogTime) VALUES (?, 'Financial', ?, ?)");
$current_time = date('Y-m-d H:i:s');
$activity = "Search ($searchTerm) ($dataType)";
$log_stmt->bind_param("sss", $username, $activity, $current_time);

if ($log_stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Financial search logged successfully']);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to log financial search']);
}

$log_stmt->close();
$conn->close();
?>