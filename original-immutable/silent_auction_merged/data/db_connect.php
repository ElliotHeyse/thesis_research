<?php
include '../config/env.php';

function db_connect($user = 'ro')
{
    global $servername, $database;
    if (strtolower($user) == 'fc' || strtolower($user) == 'fullcontrol') {
        global $username_fc, $password_fc;
        $username = $username_fc;
        $password = $password_fc;
    } elseif (strtolower($user) == 'rw' || strtolower($user) == 'readwrite') {
        global $username_rw, $password_rw;
        $username = $username_rw;
        $password = $password_rw;
    } else {
        global $username_ro, $password_ro;
        $username = $username_ro;
        $password = $password_ro;
    }

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
        // set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch (PDOException $e) {
        echo "Connection failed: " . $e->getMessage(); // TODO: asjust in production
        return false;
    }
}
?>
