<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, UPDATE, DELETE, OPTIONS, PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

class DB {
  private $host = '';
  private $username = '';
  private $password = '';
  private $database = '';

  protected $connection;

  public function __construct() {
      $this->connection = new mysqli($this->host, $this->username, $this->password, $this->database);
      if ($this->connection->connect_error) {
          die('Connection failed: ' . $this->connection->connect_error);
      }
  }
}
?>
