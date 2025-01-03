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

// Fetch user profile data
$stmt = $conn->prepare("SELECT Username, Birthday, CurrentLocation FROM Profile WHERE ProfileID = ?");
$stmt->bind_param("i", $customerID);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $data = $result->fetch_assoc();
} else {
    echo "Profile data not found.";
    exit;
}

$stmt->close();
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile</title>
    <link rel="stylesheet" href="../css/profile.css">
</head>

<body>
    <div class="profile-container">
        <h1>Profile</h1>
        <div class="profile-details">
            <h2 id="username"><?php echo $data['Username']; ?></h2>

            <p id="birthday-display">Birthday: <span id="birthday-value"><?php echo $data['Birthday']; ?></span>
                <a href="../server/UpdateProfile.php?field=birthday&value=<?php echo urlencode($data['Birthday']); ?>" id="edit-birthday-btn">Edit Birthday</a>
            </p>

            <p id="location-display">Location: <span id="location-value"><?php echo $data['CurrentLocation']; ?></span>
                <a href="../server/UpdateProfile.php?field=location&value=<?php echo urlencode($data['CurrentLocation']); ?>" id="edit-location-btn">Edit Location</a>
            </p>

            <form method="POST" action="logout.php">
                <button type="submit">Logout</button>
            </form>
        </div>
    </div>
</body>

</html>