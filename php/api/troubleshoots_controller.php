<?php
require_once '../db.php';

class TroubleshootsController extends DB {
  public function httpGet() {
    $plant_id = $_GET['plantId'];

    $query = "SELECT * FROM troubleshoots_tb WHERE plant_id = ?";

    $stmt = $this->connection->prepare($query);

    $stmt->bind_param("i", $plant_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result) {
      $troubleshoots = $result->fetch_all(MYSQLI_ASSOC);
      echo json_encode(array('success' => true, "message" => "Troubleshoot guides retrieved successfully", "data" => $troubleshoots));
    } else {
      echo json_encode(array('success' => false, "message" => "Failed to retrieve tips"));
    }
  }
}

$troubleshootsController = new TroubleshootsController();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $troubleshootsController->httpGet();
} else {
  echo json_encode(array('success' => false, 'message' => 'Invalid request method'));
}
?>