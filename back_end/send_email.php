<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

function send_email($to, $subject, $message) {
    $mail = new PHPMailer(true);

    try {
        // **SMTP beállítások**
        $mail->isSMTP();
        $mail->Host = getenv('SMTP_HOST') ?: $_ENV['SMTP_HOST'];
        $mail->SMTPAuth = true;
        $mail->Username = getenv('EMAIL_USER') ?: $_ENV['EMAIL_USER'];
        $mail->Password = getenv('EMAIL_PASS') ?: $_ENV['EMAIL_PASS'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = getenv('SMTP_PORT') ?: $_ENV['SMTP_PORT'];

        // **Feladó beállítása**
        $mail->setFrom(getenv('EMAIL_USER') ?: $_ENV['EMAIL_USER'], 'Heavy Water Adventures');
        $mail->addAddress($to);

        // **Email formázása**
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = nl2br(htmlspecialchars($message));

        // **Email küldés**
        if ($mail->send()) {
            return true;
        } else {
            file_put_contents("email_error.log", "Mail sending failed: " . $mail->ErrorInfo . "\n", FILE_APPEND);
            return false;
        }
    } catch (Exception $e) {
        file_put_contents("email_error.log", "Exception: " . $e->getMessage() . "\n", FILE_APPEND);
        return false;
    }
}
?>
