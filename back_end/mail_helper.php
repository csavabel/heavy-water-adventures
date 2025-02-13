<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

/**
 * Email küldési segédfüggvény
 *
 * @param string $to - Címzett email címe
 * @param string $subject - Email tárgya
 * @param string $body - Email tartalma (HTML formátum támogatott)
 * @return bool - Sikeres küldés esetén true, egyébként false
 */
function sendEmail($to, $subject, $body) {
    $mail = new PHPMailer(true);

    try {
       
        $mail->isSMTP();
        $mail->Host = getenv('SMTP_HOST') ?: $_ENV['SMTP_HOST'];
        $mail->SMTPAuth = true;
        $mail->Username = getenv('EMAIL_USER') ?: $_ENV['EMAIL_USER'];
        $mail->Password = getenv('EMAIL_PASS') ?: $_ENV['EMAIL_PASS'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = getenv('SMTP_PORT') ?: $_ENV['SMTP_PORT'];

        $mail->setFrom(getenv('EMAIL_USER') ?: $_ENV['EMAIL_USER'], 'Heavy Water Adventures');
        $mail->addAddress($to);

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $body;
        $mail->AltBody = strip_tags($body); 

        // Küldés
        if ($mail->send()) {
            return true;
        } else {
            file_put_contents("email_error.log", "Mail send failed: " . $mail->ErrorInfo . "\n", FILE_APPEND);
            return false;
        }

    } catch (Exception $e) {
        file_put_contents("email_error.log", "Mail error: " . $e->getMessage() . "\n", FILE_APPEND);
        return false;
    }
}
?>
