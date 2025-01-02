<?php
header('Content-Type: application/json');

// Database connection details
$host = "sql102.infinityfree.com";
$dbname = "if0_38001712_MobileAsg3";
$username = "if0_38001712";
$password = "Infinity329";

// Establish a database connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check for connection errors
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit;
}

// Retrieve input data
$data = json_decode(file_get_contents("php://input"), true);
$emailOrUsername = $conn->real_escape_string($data['emailOrUsername'] ?? '');
$birthday = $conn->real_escape_string($data['birthday'] ?? '');

// Validate input
if (empty($emailOrUsername) || empty($birthday)) {
    echo json_encode(['success' => false, 'message' => 'Email/Username and Birthday are required.']);
    exit;
}

// Check database for a matching user
$query = "SELECT CustomerID FROM Info WHERE (Email = ? OR Username = ?) AND Birthday = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("sss", $emailOrUsername, $emailOrUsername, $birthday);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'No matching account found.']);
}

$stmt->close();
$conn->close();
?>