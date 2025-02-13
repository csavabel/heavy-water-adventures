<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
    exit;
}

// **Email validálás és tisztítás**
$email = trim($_POST['newsletter-email'] ?? '');

if (empty($email)) {
    echo json_encode(["status" => "error", "message" => "Email is required."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "Invalid email format."]);
    exit;
}

// **Ellenőrizzük, hogy az email már létezik-e**
$stmt = $mysqli->prepare("SELECT id FROM subscribers WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "This email is already subscribed."]);
    $stmt->close();
    exit;
}
$stmt->close();

// **Feliratkozás mentése az adatbázisba**
$stmt = $mysqli->prepare("INSERT INTO subscribers (email) VALUES (?)");
$stmt->bind_param("s", $email);

if ($stmt->execute()) {
    $stmt->close();

    // **Visszajelző email küldése a felhasználónak**
    require_once 'mail_helper.php';
    
    $subject = "Subscription Confirmation";
    $message = "
        <h2>Thank you for subscribing!</h2>
        <p>You have successfully subscribed to Heavy Water Adventures' newsletter.</p>
        <p>Stay tuned for exclusive updates and offers.</p>
        <br>
        <p>Best regards,</p>
        <p><strong>Heavy Water Adventures Team</strong></p>
    ";

    $email_sent = sendEmail($email, $subject, $message);

    if ($email_sent) {
        echo json_encode(["status" => "success", "message" => "Subscription successful! A confirmation email has been sent."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Subscription successful, but email sending failed."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Database error: " . $mysqli->error]);
}

$mysqli->close();
?>
