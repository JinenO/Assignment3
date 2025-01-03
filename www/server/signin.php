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
    $checkQuery = "SELECT * FROM UserInfo WHERE Email = ? OR Username = ?";
    $stmt = $conn->prepare($checkQuery);
    $stmt->bind_param("ss", $email, $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $errors[] = "The email or username is already registered. Please choose a different one or log in.";
    }

    // If there are errors, store them in the session
    if (!empty($errors)) {
        $_SESSION['errors'] = $errors;
        header("Location: signin.php"); // Redirect back to the same page
        exit;
    }

    // Hash the password
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    // Get the current timestamp in Malaysia Time
    $currentTimestamp = date('Y-m-d H:i:s');

    // Prepare the SQL statement for the UserInfo table
    $stmt = $conn->prepare("INSERT INTO UserInfo (Username, PasswordHash, Email, Birthday, CreateAt) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $username, $passwordHash, $email, $birthday, $currentTimestamp);

    // Execute the statement and check for success
    if ($stmt->execute()) {
        $_SESSION['success'] = "Registration successful. Please log in.";
        header("Location: signin.php");
        exit;
    } else {
        $_SESSION['errors'][] = "Error: " . $stmt->error;
        header("Location: signin.php");
        exit;
    }

    // Close the statement and connection
    $stmt->close();
}

$conn->close();
?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Result</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f9;
            color: #333;
            text-align: center;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            font-size: 28px;
            margin-bottom: 20px;
        }

        .message {
            margin: 20px 0;
        }

        .error {
            color: #e74c3c;
            background-color: #fdecea;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }

        .success {
            color: #2ecc71;
            background-color: #eafaf1;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }

        a {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            color: #ffffff;
            background-color: #3498db;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }

        a:hover {
            background-color: #2980b9;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Registration Result</h1>
        <div class="message">
            <?php
            // Display error messages if they exist
            if (isset($_SESSION['errors'])) {
                echo "<div class='error'>";
                echo "<strong>Error:</strong><ul>";
                foreach ($_SESSION['errors'] as $error) {
                    echo "<li>$error</li>";
                }
                echo "</ul></div>";
                unset($_SESSION['errors']); // Clear errors after displaying them
                echo "<a href='../signin.html'>Go Back to Sign In</a>";
            }

            // Display success message if it exists
            if (isset($_SESSION['success'])) {
                echo "<div class='success'>";
                echo "<p>{$_SESSION['success']}</p>";
                echo "</div>";
                unset($_SESSION['success']); // Clear success message after displaying
                echo "<a href='../login.html'>Go to Login Page</a>";
            }
            ?>
        </div>
    </div>
</body>

</html>