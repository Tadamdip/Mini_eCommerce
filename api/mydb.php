<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "miniecommerce";

try {
    $pdo = new PDO("mysql:host=$host; dbname=$dbname; charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    // If we can't connect, return a JSON error and stop
    header('Content-Type: application/json');
    echo json_encode(["success" => false, "message" => "DB Connection failed: " . $e->getMessage()]);
    exit;
}
