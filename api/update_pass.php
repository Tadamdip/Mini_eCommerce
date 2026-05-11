<?php
header('Content-Type: application/json');
require_once __DIR__ . '/mydb.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['username']) || empty($data['newPassword'])) {
    echo json_encode(["success" => false, "message" => "Invalid data."]);
    exit;
}

$stmt = $pdo->prepare("UPDATE users SET password = ? WHERE username = ?");
$stmt->execute([$data['newPassword'], $data['username']]);

if ($stmt->rowCount() > 0) {
    echo json_encode(["success" => true, "message" => "Password updated."]);
} else {
    echo json_encode(["success" => false, "message" => "User not found or no change made."]);
}
?>
