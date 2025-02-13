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

$lodge = htmlspecialchars($_POST['lodge'] ?? '');
$checkin = $_POST['checkin'] ?? '';
$checkout = $_POST['checkout'] ?? '';
$guests = isset($_POST['guests']) ? (int)$_POST['guests'] : 0;
$name = htmlspecialchars($_POST['name'] ?? '');
$email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
$phone = htmlspecialchars($_POST['phone'] ?? '');
$requests = !empty($_POST['requests']) ? htmlspecialchars($_POST['requests']) : 'N/A';
$newsletter = $_POST['newsletter'] ?? 'no';

if (!$lodge || !$checkin || !$checkout || !$guests || !$name || !$email || !$phone) {
    echo json_encode(["status" => "error", "message" => "Missing required fields."]);
    exit;
}

$stmt = $mysqli->prepare("INSERT INTO bookings (lodge, checkin, checkout, guests, name, email, phone, requests) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssissss", $lodge, $checkin, $checkout, $guests, $name, $email, $phone, $requests);

if ($stmt->execute()) {

    if ($newsletter === "yes") {
        $stmt_sub = $mysqli->prepare("INSERT IGNORE INTO subscribers (email) VALUES (?)");
        $stmt_sub->bind_param("s", $email);
        $stmt_sub->execute();
        $stmt_sub->close();
    }

    $admin_email = getenv('EMAIL_USER') ?: $_ENV['EMAIL_USER'];
    $subject_admin = "New Booking from $name";
    $message_admin = "
        <h2>New Booking Request</h2>
        <p><strong>Lodge:</strong> $lodge</p>
        <p><strong>Check-in:</strong> $checkin</p>
        <p><strong>Check-out:</strong> $checkout</p>
        <p><strong>Guests:</strong> $guests</p>
        <p><strong>Name:</strong> $name</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Phone:</strong> $phone</p>
        <p><strong>Requests:</strong> $requests</p>
    ";

    $subject_user = "Your Booking Confirmation";
    $message_user = "
        <h2>Dear $name,</h2>
        <p>Thank you for your reservation at <strong>Heavy Water Adventures</strong>!</p>
        <p>We will contact you shortly.</p>
        <h3>Booking Details:</h3>
        <p><strong>Lodge:</strong> $lodge</p>
        <p><strong>Check-in:</strong> $checkin</p>
        <p><strong>Check-out:</strong> $checkout</p>
        <p><strong>Guests:</strong> $guests</p>
        <p><strong>Requests:</strong> $requests</p>
        <br>
        <p>Best regards,<br><strong>Heavy Water Adventures Team</strong></p>
    ";

    $admin_sent = sendEmail($admin_email, $subject_admin, $message_admin);
    $user_sent = sendEmail($email, $subject_user, $message_user);

    if (!$admin_sent || !$user_sent) {
        echo json_encode(["status" => "error", "message" => "Email sending failed."]);
    } else {
        echo json_encode(["status" => "success", "message" => "Booking request submitted and email sent!"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Database error: " . $mysqli->error]);
}

$stmt->close();
$mysqli->close();
?>
