<?php
session_start();

$host = "sql102.infinityfree.com";
$dbname = "if0_38001712_MobileAsg3";
$username = "if0_38001712";
$password = "Infinity329";

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

if (!isset($_SESSION['CustomerID'])) {
    echo json_encode(["error" => "User not logged in."]);
    exit;
}

$customer_id = $_SESSION['CustomerID'];

$stmt = $conn->prepare("
    SELECT u.Username, p.CurrentLocation 
    FROM UserInfo u 
    LEFT JOIN Profile p ON u.CustomerID = p.ProfileID 
    WHERE u.CustomerID = ?
");
$stmt->bind_param("i", $customer_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    echo json_encode($user);
} else {
    echo json_encode(["error" => "User data not found."]);
}

$stmt->close();
$conn->close();
?>
