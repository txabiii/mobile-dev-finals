<?php
$servername = "tetra.bloom.host";  
$username = "u9206_FDwUtffAf1";  
$password = "gQTInbDjfubfKlSVcrxsjSql"; 
$database = "s9206_mobdevdb";  

// Create a connection
$conn = new mysqli($servername, $username, $password, $database);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Connection successful
echo "Connected to the database successfully.";

// Close the connection
$conn->close();
?>
