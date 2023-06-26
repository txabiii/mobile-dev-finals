<?php
header("Access-Control-Allow-Origin: *");

header("Access-Control-Allow-Methods: GET, POST, UPDATE, DELETE");

header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, UPDATE, DELETE');
    header('Access-Control-Max-Age: 86400');
    header('HTTP/1.1 200 OK');
    exit;
}

class DB {
  private $host = 'tetra.bloom.host';
  private $username = 'u9206_FDwUtffAf1';
  private $password = 'gQTInbDjfubfKlSVcrxsjSql';
  private $database = 's9206_mobdevdb';

  protected $connection;

  public function __construct() {
      $this->connection = new mysqli($this->host, $this->username, $this->password, $this->database);
      if ($this->connection->connect_error) {
          die('Connection failed: ' . $this->connection->connect_error);
      }
  }
}
?>
