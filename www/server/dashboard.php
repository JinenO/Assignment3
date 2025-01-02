<?php
session_start(); // Start the session

// Check if the user is logged in (i.e., if the session variable is set)
if (!isset($_SESSION['username'])) {
    // Redirect to login page if the user is not logged in
    header("Location: login.html");
    exit;
}

// Retrieve the username from the session
$username = $_SESSION['username'];
?>
