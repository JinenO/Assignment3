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

// Start a session
session_start();

$error_message = "";

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve and sanitize input
    $email = $conn->real_escape_string($_POST['email']);
    $password = $_POST['password']; // Password will be verified later

    // Validate inputs
    if (empty($email) || empty($password)) {
        $error_message = "Both email and password are required.";
    } else {
        // Prepare and execute a query to check if the user exists
        $stmt = $conn->prepare("SELECT CustomerID, Username, PasswordHash FROM Info WHERE Email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            // Fetch the user data
            $user = $result->fetch_assoc();

            // Verify the password
            if (password_verify($password, $user['PasswordHash'])) {
                // Login successful: Store user info in session
                $_SESSION['CustomerID'] = $user['CustomerID'];
                $_SESSION['Username'] = $user['Username'];

                // Redirect to a dashboard or home page
                header("Location: ../dashboard.html"); // Replace with your dashboard or home page
                exit;
            } else {
                $error_message = "Invalid email or password.";
            }
        } else {
            $error_message = "No account found with this email.";
        }

        // Close the statement
        $stmt->close();
    }
}

$conn->close();
?>