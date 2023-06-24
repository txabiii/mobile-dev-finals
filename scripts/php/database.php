<?php
$servername = "tetra.bloom.host";  
$username = "u9206_FDwUtffAf1";  
$password = "gQTInbDjfubfKlSVcrxsjSql"; 
$database = "s9206_mobdevdb";  

// Create a connection
$connection = new mysqli($servername, $username, $password, $database);

// Check the connection
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

// Connection successful
json_encode("Connected to the database successfully.") ;

?>
