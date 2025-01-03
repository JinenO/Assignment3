<?php
// Start the session
session_start();

// Database connection details
$host = "sql102.infinityfree.com";
$dbname = "if0_38001712_MobileAsg3";
$username = "if0_38001712";
$password = "Infinity329";

// Establish a database connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check for connection errors
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Check if the user is logged in
if (!isset($_SESSION['CustomerID'])) {
    echo json_encode(["error" => "User not logged in."]);
    exit;
}

// Retrieve POST data
$field = $_POST['field'] ?? '';
$new_value = $_POST['new_value'] ?? '';
$customer_id = $_SESSION['CustomerID'];

// Validate input and update the appropriate table
if ($field === 'Birthday' && $new_value) {
    // Ensure proper date format
    $date = DateTime::createFromFormat('Y-m-d', $new_value);
    if (!$date) {
        echo json_encode(["error" => "Invalid date format."]);
        exit;
    }

    // Update the Birthday field in the UserInfo table
    $stmt = $conn->prepare("UPDATE UserInfo SET Birthday = ? WHERE CustomerID = ?");
    $stmt->bind_param("si", $new_value, $customer_id);
} elseif ($field === 'CurrentLocation' && $new_value) {
    // Update the CurrentLocation field in the Profile table
    $stmt = $conn->prepare("UPDATE Profile SET CurrentLocation = ? WHERE ProfileID = ?");
    $stmt->bind_param("si", $new_value, $customer_id);
} else {
    echo json_encode(["error" => "Invalid input."]);
    exit;
}

// Execute the update and respond
if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Failed to update profile."]);
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>