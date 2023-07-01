<?php
require_once '../db.php';

class TipsController extends DB {

  public function httpPost($payload) {
    if($payload['action'] === 'create-tip') {

      $plant_id = $payload['plantId']; 
      $title = $payload['title'];
      $content = $payload['content'];

      $query = "INSERT INTO tips_tb (plant_id, title, content) VALUES (?, ?, ?)";

      $stmt = $this->connection->prepare($query);

      $stmt->bind_param("iss", $plant_id, $title, $content);

      if ($stmt->execute()) {
        echo json_encode(array('success' => true, 'message' => 'Tip created successfully'));
      } else {
        echo json_encode(array('success' => false, 'message' => 'Failed to create tip'));
      }
    }
  }

  public function httpGet() {
    $action = $_GET['action'];

    if($action === 'get-all-tips') {
      $query = "SELECT * FROM tips_tb";
      $result = $this->connection->query($query);

      if ($result) {
        $tips = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode(array('success' => true, "message" => "Tips retrieved successfully", "data" => $tips));
      } else {
        echo json_encode(array('success' => false, "message" => "Failed to retrieve tips"));
      }
      $this->connection->close();
    } elseif($action === 'get-plant-tips') {      
      $plant_id = $_GET['plant_id'];

      $query = "SELECT * FROM tips_tb WHERE plant_id = ?";
      $stmt = $this->connection->prepare($query);

      $stmt->bind_param("i", $plant_id);
      $stmt->execute();
      $result = $stmt->get_result();
      
      if ($result) {
        $tips = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode(array('success' => true, "message" => "Reports retrieved successfully", "data" => $tips));
      } else {
        echo json_encode(array('success' => false, "message" => "Failed to retrieve tips"));
      }
    }
  }

  public function httpPut($payload) {
    $tip_id = $payload['tipId'];
    $title = $payload['title'];
    $content = $payload['content'];

    $query = "UPDATE tips_tb SET title = ?, content = ? WHERE tip_id = ?";
    $stmt = $this->connection->prepare($query);
    $stmt->bind_param("ssi", $title, $content, $tip_id);
    if ($stmt->execute()) {
      return json_encode(array('success' => true, 'message' => 'Tip updated successfully'));
    } else {
      return json_encode(array('success' => false, 'message' => 'Failed to update tip'));
    }
  }

  public function httpDelete($payload) {
    $tip_id = $payload['tipId'];

    $query = "DELETE FROM tips_tb WHERE tip_id = ?";
    $stmt = $this->connection->prepare($query);
    $stmt->bind_param("i", $tip_id);
    if ($stmt->execute()) {
      return json_encode(array('success' => true, 'message' => 'Tip deleted successfully'));
    } else {
      return json_encode(array('success' => false, 'message' => 'Failed to delete tip'));
    }
  }
}

$tipController = new TipsController();

$received_data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $tipController->httpPost($received_data);
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $tipController->httpGet();
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $tipController->httpPut($received_data);
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  $tipController->httpDelete($received_data);
} else {
  echo json_encode(array('success' => false, 'message' => 'Invalid request method'));
}
?>