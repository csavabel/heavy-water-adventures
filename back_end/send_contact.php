<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

require_once 'config.php';
require_once 'mail_helper.php';

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
    exit;
}

// **Adatok tisztítása és validálása**
$name = htmlspecialchars(trim($_POST['contact-name'] ?? ''));
$email = filter_var($_POST['contact-email'] ?? '', FILTER_VALIDATE_EMAIL);
$message = htmlspecialchars(trim($_POST['message'] ?? ''));
$newsletter = $_POST['contact-newsletter'] ?? 'no';

// **Ha az e-mail nem érvényes, hibát adunk vissza**
if (!$email) {
    echo json_encode(["status" => "error", "message" => "Invalid email format."]);
    exit;
}

// **Adatok mentése az adatbázisba**
$stmt = $mysqli->prepare("INSERT INTO contact_messages (name, email, message, newsletter) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $name, $email, $message, $newsletter);

if ($stmt->execute()) {
    $stmt->close();

    // **Hírlevél feliratkozás mentése**
    if ($newsletter === "yes") {
        $stmt_sub = $mysqli->prepare("INSERT IGNORE INTO subscribers (email) VALUES (?)");
        $stmt_sub->bind_param("s", $email);
        $stmt_sub->execute();
        $stmt_sub->close();
    }

    // **Admin email címének lekérése az .env fájlból**
    $admin_email = getenv('EMAIL_USER') ?: $_ENV['EMAIL_USER'];
    $subject_admin = "New Contact Message from $name";

    $message_admin = "
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> $name</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Message:</strong></p>
        <p>$message</p>
        <p><strong>Newsletter Subscription:</strong> $newsletter</p>
    ";

    // **Email küldés az adminnak**
    $admin_sent = sendEmail($admin_email, $subject_admin, $message_admin);

    if (!$admin_sent) {
        echo json_encode(["status" => "error", "message" => "Email sending failed."]);
    } else {
        echo json_encode(["status" => "success", "message" => "Message sent successfully!"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Database error: " . $mysqli->error]);
}

// **Kapcsolat lezárása**
$mysqli->close();
?>
