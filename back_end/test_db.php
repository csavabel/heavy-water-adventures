<?php
require_once 'config.php';

header('Content-Type: text/plain');

if ($mysqli->ping()) {
    echo "✅ Database connection successful!";
} else {
    echo "❌ Database connection failed: " . $mysqli->error;
}

$mysqli->close();
?>
