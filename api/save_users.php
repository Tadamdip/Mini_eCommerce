<?php
header('Content-Type: application/json');
require_once __DIR__ . '/mydb.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['username']) || empty($data['password'])) {
    echo json_encode(["success" => false, "message" => "Invalid data."]);
    exit;
}

// Check if username already exists
$check = $pdo->prepare("SELECT id FROM users WHERE username = ?");
$check->execute([$data['username']]);
if ($check->fetch()) {
    echo json_encode(["success" => false, "message" => "Username already exists."]);
    exit;
}

// Insert new user
$stmt = $pdo->prepare("
    INSERT INTO users (firstName, middleName, lastName, address, email, username, password)
    VALUES (?, ?, ?, ?, ?, ?, ?)
");

$stmt->execute([
    $data['firstName'],
    $data['middleName'] ?? '',
    $data['lastName'],
    $data['address'],
    $data['email'],
    $data['username'],
    $data['password']   // plain text — consider password_hash() later
]);

echo json_encode(["success" => true, "message" => "User registered successfully."]);
?>
