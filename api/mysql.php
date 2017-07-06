<?php
function connect_to_db() {
    $host = 'localhost'; // this may be an ip address instead
    $db = 'mymedi13_air'; // name of your database
    $user = 'cwood';
    $pass = '!*******';
    $charset = 'utf8';
    #$connection = new mysqli($server, $user, $pass, $database);
    
    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $opt = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $pdo = new PDO($dsn, $user, $pass, $opt);
   
    return $pdo;
}

?>

