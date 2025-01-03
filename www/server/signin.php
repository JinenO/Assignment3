<?php
session_start(); // Start the session

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

// Set the timezone to Malaysia Time (UTC+8)
date_default_timezone_set('Asia/Kuala_Lumpur');

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve and sanitize form inputs
    $email = $conn->real_escape_string($_POST['email']);
    $username = $conn->real_escape_string($_POST['username']);
    $birthday = $conn->real_escape_string($_POST['birthday']);
    $password = $_POST['password']; // Do not hash yet for validation

    // Initialize error messages
    $errors = [];

    // Validate input fields
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format.";
    }
    if (strlen($username) < 3) {
        $errors[] = "Username must be at least 3 characters.";
    }
    if (strlen($password) < 8) {
        $errors[] = "Password must be at least 8 characters.";
    }
    if (empty($birthday)) {
        $errors[] = "Birthday cannot be empty.";
    }

    // Check if the email or username already exists in the UserInfo table
    $checkQuery = "SELECT * FROM UserInfo WHERE Email = '$email' OR Username = '$username'";
    $result = $conn->query($checkQuery);

    if ($result->num_rows > 0) {
        $errors[] = "The email or username is already registered. Please choose a different one or log in.";
    }

    // If there are errors, store them in the session and redirect to the result page
    if (!empty($errors)) {
        $_SESSION['errors'] = $errors; // Store error messages in session
        $_SESSION['old'] = $_POST; // Store old input values to retain in the form
        header("Location: result.php"); // Redirect to result page
        exit;
    }

    // Hash the password
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    // Get the current timestamp in Malaysia Time
    $currentTimestamp = date('Y-m-d H:i:s'); // This will use Malaysia Time

    // Prepare the SQL statement for the UserInfo table
    $stmt = $conn->prepare("INSERT INTO UserInfo (Username, PasswordHash, Email, Birthday, CreateAt) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $username, $passwordHash, $email, $birthday, $currentTimestamp);

    // Execute the statement and check for success
    if ($stmt->execute()) {
        // Store username in session after successful account creation
        $_SESSION['username'] = $username; // Store the username in session

        // Set success message in session
        $_SESSION['success'] = "Registration successful. Please log in.";

        // Redirect to the result page
        header("Location: result.php");
        exit;
    } else {
        // Error message on failure
        $_SESSION['errors'][] = "Error: " . $stmt->error;
        header("Location: result.php"); // Redirect to result page with error
        exit;
    }

    // Close the statement and connection
    $stmt->close();
}

$conn->close();
?>
