<?php
session_start(); // Start the session
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Result</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin-top: 50px;
        }

        .message {
            margin: 20px;
        }

        .error {
            color: red;
        }

        .success {
            color: green;
        }
    </style>
</head>

<body>
    <div class="message">
        <?php
        // Display error messages if they exist
        if (isset($_SESSION['errors'])) {
            echo "<div class='error'>";
            foreach ($_SESSION['errors'] as $error) {
                echo "<p>$error</p>";
            }
            unset($_SESSION['errors']); // Clear errors after displaying them
            echo "</div>";

            // Provide a link to go back to the sign-in page
            echo "<p><a href='../signin.html'>Go back to Sign In Page</a></p>";
        }

        // Display success message if it exists
        if (isset($_SESSION['success'])) {
            echo "<div class='success'>";
            echo "<p>{$_SESSION['success']}</p>";
            unset($_SESSION['success']); // Clear success message after displaying
            echo "</div>";

            // Provide a link to go to the login page
            echo "<p><a href='../login.html'>Go to Login Page</a></p>";
        }
        ?>
    </div>
</body>

</html>