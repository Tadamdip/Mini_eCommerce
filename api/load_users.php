<?php
header('Content-Type: application/json');
require_once __DIR__ . '/mydb.php';

$stmt = $pdo->query("SELECT firstName, middleName, lastName, address, email, username, password FROM users");
$users = $stmt->fetchAll();

echo json_encode($users);
?>
