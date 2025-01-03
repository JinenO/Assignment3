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
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Check if the user is logged in
if (!isset($_SESSION['CustomerID'])) {
    echo json_encode(["error" => "User not logged in."]);
    exit;
}

// Get the logged-in user's ID
$customer_id = $_SESSION['CustomerID'];

// Fetch user data from the database
$stmt = $conn->prepare("
    SELECT u.Username, p.CurrentLocation, u.Birthday 
    FROM UserInfo u 
    LEFT JOIN Profile p ON u.CustomerID = p.ProfileID 
    WHERE u.CustomerID = ?
");
$stmt->bind_param("i", $customer_id);
$stmt->execute();
$result = $stmt->get_result();

// Check if user data exists
if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    echo json_encode($user);
} else {
    echo json_encode(["error" => "User data not found."]);
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>