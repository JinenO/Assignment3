<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['CustomerID'])) {
    echo json_encode(["success" => false, "error" => "User not logged in."]);
    exit;
}

// Database connection
$host = "sql102.infinityfree.com";
$dbname = "if0_38001712_MobileAsg3";
$username = "if0_38001712";
$password = "Infinity329";

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "error" => "Connection failed: " . $conn->connect_error]));
}

// Pagination and filters
$records_per_page = 15;
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$offset = ($page - 1) * $records_per_page;

// Get filter values
$user_filter = $_GET['user'] ?? '';
$api_filter = $_GET['api'] ?? '';
$date_filter = $_GET['date'] ?? '';

// Base query
$query = "SELECT LogID, Username, Api, UserActivity, LogTime FROM LogInteraction WHERE 1=1";

// Add filters (using prepared statements for security)
$params = [];
if (!empty($user_filter)) {
    $query .= " AND Username = ?";
    $params[] = $user_filter;
}
if (!empty($api_filter)) {
    $query .= " AND Api = ?";
    $params[] = $api_filter;
}
if (!empty($date_filter)) {
    $query .= " AND DATE(LogTime) = ?";
    $params[] = $date_filter;
}

// Get total records
$stmt = $conn->prepare($query);
if (!empty($params)) {
    $stmt->bind_param(str_repeat('s', count($params)), ...$params);
}
$stmt->execute();
$total_result = $stmt->get_result();
$total_records = $total_result->num_rows;
$total_pages = ceil($total_records / $records_per_page);

// Add limit for pagination
$query .= " LIMIT ?, ?";
$params[] = $offset;
$params[] = $records_per_page;

// Execute the paginated query
$stmt = $conn->prepare($query);
$stmt->bind_param(str_repeat('s', count($params) - 2) . 'ii', ...$params);
$stmt->execute();
$result = $stmt->get_result();

// Fetch records
$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

// Return JSON response
echo json_encode([
    "success" => true,
    "data" => $data,
    "total_pages" => $total_pages
]);

$conn->close();
?>