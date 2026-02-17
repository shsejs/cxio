
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Database configuration
$host = 'sql113.infinityfree.com';
$db   = 'if0_41080364_chirkut_db';
$user = 'if0_41080364'; // Change to your DB username
$pass = '22370504';     // Change to your DB password
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

$action = $_GET['action'] ?? '';
$data = json_decode(file_get_contents('php://input'), true);

switch ($action) {
    case 'register':
        if (!isset($data['username'], $data['fullName'], $data['password'])) {
            echo json_encode(['error' => 'Incomplete data']);
            break;
        }
        $stmt = $pdo->prepare("INSERT INTO users (username, full_name, password) VALUES (?, ?, ?)");
        try {
            $stmt->execute([$data['username'], $data['fullName'], $data['password']]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Username already taken']);
        }
        break;

    case 'login':
        $stmt = $pdo->prepare("SELECT username, full_name as fullName, created_at as createdAt FROM users WHERE username = ? AND password = ?");
        $stmt->execute([$data['username'], $data['password']]);
        $user = $stmt->fetch();
        if ($user) {
            echo json_encode(['success' => true, 'user' => $user]);
        } else {
            echo json_encode(['error' => 'Invalid credentials']);
        }
        break;

    case 'send_message':
        $stmt = $pdo->prepare("INSERT INTO messages (target_username, content) VALUES (?, ?)");
        $stmt->execute([$data['to'], $data['content']]);
        echo json_encode(['success' => true]);
        break;

    case 'get_messages':
        $username = $_GET['username'] ?? '';
        $stmt = $pdo->prepare("SELECT id, content, created_at as timestamp, is_read as isRead FROM messages WHERE target_username = ? ORDER BY created_at DESC");
        $stmt->execute([$username]);
        echo json_encode($stmt->fetchAll());
        break;

    case 'delete_message':
        $stmt = $pdo->prepare("DELETE FROM messages WHERE id = ?");
        $stmt->execute([$data['id']]);
        echo json_encode(['success' => true]);
        break;

    case 'update_profile':
        $stmt = $pdo->prepare("UPDATE users SET full_name = ?, password = IF(? != '', ?, password) WHERE username = ?");
        $stmt->execute([$data['fullName'], $data['password'], $data['password'], $data['username']]);
        echo json_encode(['success' => true]);
        break;

    default:
        echo json_encode(['error' => 'Invalid action']);
        break;
}
?>
