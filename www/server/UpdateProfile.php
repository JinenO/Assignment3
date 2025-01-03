<?php
session_start();
$customerID = $_SESSION['CustomerID'] ?? null;

// Check if user is logged in
if (!$customerID) {
    header("Location: login.html");
    exit;
}

// Include your database connection here
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

// Process form data when submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $field = $_POST['field'];
    $value = $_POST['value'];

    // Update profile in the database
    $stmt = $conn->prepare("UPDATE Profile SET $field = ? WHERE ProfileID = ?");
    $stmt->bind_param("si", $value, $customerID);
    $stmt->execute();
    $stmt->close();

    // Redirect to the profile page
    header("Location: profile.php");
    exit;
}

// Handle GET request to show the current field and value for editing
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $field = $_GET['field'];
    $value = $_GET['value'];

    // Check for valid field and show input for the value to edit
    if ($field === 'birthday') {
        $fieldLabel = 'Birthday';
    } elseif ($field === 'location') {
        $fieldLabel = 'Location';
    } else {
        echo "Invalid field!";
        exit;
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Profile</title>
    <link rel="stylesheet" href="../css/profile.css">
</head>

<body>
    <div class="profile-container">
        <h1>Edit <?php echo $fieldLabel; ?></h1>

        <form method="POST" action="update_profile.php">
            <input type="text" name="value" placeholder="New <?php echo $fieldLabel; ?>" value="<?php echo htmlspecialchars($value); ?>" required>
            <input type="hidden" name="field" value="<?php echo $field; ?>">
            <button type="submit">Save</button>
        </form>

        <a href="../server/profile.php">Back to Profile</a>
    </div>
</body>

</html>