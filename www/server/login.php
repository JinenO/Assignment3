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
        $stmt = $conn->prepare("SELECT CustomerID, Username, PasswordHash FROM UserInfo WHERE Email = ?");
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

                // Log the login activity
                $log_stmt = $conn->prepare("INSERT INTO LogInteraction (Username, Api, UserActivity, LogTime) VALUES (?, 'none', 'login', ?)");
                $current_time = date('Y-m-d H:i:s'); // Get current Malaysia time
                $log_stmt->bind_param("ss", $user['Username'], $current_time);
                $log_stmt->execute();
                $log_stmt->close();

                // Redirect to a dashboard or home page
                header("Location: ../Home.html"); // Replace with your dashboard or home page
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

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Error</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f9f9f9;
            color: #333;
            text-align: center;
            padding: 20px;
        }

        .container {
            max-width: 500px;
            margin: 50px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        h2 {
            font-size: 24px;
            margin-bottom: 15px;
        }

        p {
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 20px;
        }

        .error {
            color: #e74c3c;
            background-color: #fdecea;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-weight: bold;
        }

        a {
            display: inline-block;
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
        <?php if (!empty($error_message)): ?>
            <h2>Login Error</h2>
            <div class="error"><?php echo htmlspecialchars($error_message); ?></div>
            <p>Please check your credentials and try again.</p>
            <a href="../login.html">Go Back to Login</a>
        <?php else: ?>
            <h2>Unknown Error</h2>
            <p>An unexpected error occurred. Please try again later.</p>
            <a href="../login.html">Go Back to Login</a>
        <?php endif; ?>
    </div>
</body>

</html>