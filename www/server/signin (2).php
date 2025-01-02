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

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve and sanitize form inputs
    $email = $conn->real_escape_string($_POST['email']);
    $username = $conn->real_escape_string($_POST['username']);
    $birthday = $conn->real_escape_string($_POST['birthday']);
    $password = $_POST['password']; // Do not hash yet for validation

    // Validate input fields
    $errors = [];

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

    // Check if the email or username already exists in the database
    $checkQuery = "SELECT * FROM Info WHERE Email = '$email' OR Username = '$username'";
    $result = $conn->query($checkQuery);

    if ($result->num_rows > 0) {
        $errors[] = "The email or username is already registered. Please choose a different one or log in.";
    }

    // If validation fails, display errors and exit
    if (!empty($errors)) {
        foreach ($errors as $error) {
            echo "<p style='color:red;'>$error</p>";
        }
        echo "<p><a href='../login.html'>Go to Login Page</a></p>";
        exit;
    }

    // Hash the password
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    // Prepare the SQL statement
    $stmt = $conn->prepare("INSERT INTO Info (Username, PasswordHash, Email, Birthday) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $username, $passwordHash, $email, $birthday);

    // Execute the statement and check for success
    if ($stmt->execute()) {
        // Store username in session after successful account creation
        $_SESSION['username'] = $username; // Store the username in session
        
        // Redirect to login page after successful account creation
        header("Location: ../login.html");
        exit;
    } else {
        echo "<p style='color:red;'>Error: " . $stmt->error . "</p>";
    }

    // Close the statement and connection
    $stmt->close();
}

$conn->close();
?>
