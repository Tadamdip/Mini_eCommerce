<?php
header('Content-Type: application/json');

$file = __DIR__ . '/../users.json';

$data = file_get_contents("php://input");
$users = json_decode($data, true);

if ($users === null) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid  data."
    ]);
    exit;
}

$result = file_put_contents($file, json_encode($users, JSON_PRETTY_PRINT));
if ($result === false) {
    echo json_encode([
        "success" => false,
        "message" => "Failed to save users."
    ]);
} else {
    echo json_encode([
        "success" => true,
        "message" => "Users saved successfully."
    ]);
}
?>