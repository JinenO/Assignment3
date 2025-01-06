<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['CustomerID'])) {
    die("Please log in to export data.");
}

// Database connection details
$host = "sql102.infinityfree.com";
$dbname = "if0_38001712_MobileAsg3";
$username = "if0_38001712";
$password = "Infinity329";

try {
    $conn = new mysqli($host, $username, $password, $dbname);

    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    $format = $_GET['format'] ?? 'csv';

    // Build query with filters
    $query = "SELECT * FROM LogInteraction WHERE 1=1";
    $params = [];

    if (!empty($_GET['user'])) {
        $query .= " AND Username = ?";
        $params[] = $_GET['user'];
    }

    if (!empty($_GET['api'])) {
        $query .= " AND Api = ?";
        $params[] = $_GET['api'];
    }

    if (!empty($_GET['date'])) {
        $query .= " AND DATE(LogTime) = ?";
        $params[] = $_GET['date'];
    }

    $stmt = $conn->prepare($query);

    if (!empty($params)) {
        $stmt->bind_param(str_repeat('s', count($params)), ...$params);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        die("No data found matching your criteria.");
    }

    $filename = 'log_records_' . date('Y-m-d_His');

    if ($format === 'csv') {
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment;filename=' . $filename . '.csv');
        $output = fopen('php://output', 'w');

        // Add UTF-8 BOM for Excel compatibility
        fprintf($output, chr(0xEF) . chr(0xBB) . chr(0xBF));

        fputcsv($output, ['LogID', 'Username', 'Api', 'UserActivity', 'LogTime']);
        while ($row = $result->fetch_assoc()) {
            // Format LogTime as dd/mm/yyyy, h:i:s A
            $row['LogTime'] = (new DateTime($row['LogTime']))->format('d/m/Y, h:i:s A');
            fputcsv($output, $row);
        }
        fclose($output);
    } elseif ($format === 'excel') {
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename=' . $filename . '.xls');

        // Add UTF-8 BOM for Excel compatibility
        echo chr(0xEF) . chr(0xBB) . chr(0xBF);

        echo "LogID\tUsername\tApi\tUserActivity\tLogTime\n";
        while ($row = $result->fetch_assoc()) {
            // Format LogTime as dd/mm/yyyy, h:i:s A
            $row['LogTime'] = (new DateTime($row['LogTime']))->format('d/m/Y, h:i:s A');
            echo implode("\t", array_map('htmlspecialchars', $row)) . "\n";
        }
    }

    $conn->close();
} catch (Exception $e) {
    die("Error: " . $e->getMessage());
}
?>