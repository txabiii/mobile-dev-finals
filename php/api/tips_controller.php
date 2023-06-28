<?php
require_once '../db.php';

class TipsController extends DB {
  // Function to create a new tip
  public function createTip($plant_id, $title, $content) {
    $query = "INSERT INTO tips_tb (plant_id, title, content) VALUES (?, ?, ?)";
    $stmt = $this->connection->prepare($query);
    $stmt->bind_param("iss", $plant_id, $title, $content);
    if ($stmt->execute()) {
      return json_encode(['success' => true, 'message' => 'Tip created successfully']);
    } else {
      return json_encode(['success' => false, 'message' => 'Failed to create tip']);
    }
  }

  // Function to get tips for a certain plant ID
  public function getTips($plant_id) {
    $query = "SELECT * FROM tips_tb WHERE plant_id = ?";
    $stmt = $this->connection->prepare($query);
    $stmt->bind_param("i", $plant_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $tips = $result->fetch_all(MYSQLI_ASSOC);
    return json_encode($tips);
  }

  // Function to update a particular tip
  public function updateTip($tip_id, $title, $content) {
    $query = "UPDATE tips_tb SET title = ?, content = ? WHERE tip_id = ?";
    $stmt = $this->connection->prepare($query);
    $stmt->bind_param("ssi", $title, $content, $tip_id);
    if ($stmt->execute()) {
      return json_encode(['success' => true, 'message' => 'Tip updated successfully']);
    } else {
      return json_encode(['success' => false, 'message' => 'Failed to update tip']);
    }
  }

  // Function to delete a particular tip
  public function deleteTip($tip_id) {
    $query = "DELETE FROM tips_tb WHERE tip_id = ?";
    $stmt = $this->connection->prepare($query);
    $stmt->bind_param("i", $tip_id);
    if ($stmt->execute()) {
      return json_encode(['success' => true, 'message' => 'Tip deleted successfully']);
    } else {
      return json_encode(['success' => false, 'message' => 'Failed to delete tip']);
    }
  }
}

// Handle different server request methods and perform corresponding actions
$tipController = new TipsController();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Create a new tip
  $plant_id = $_POST['plant_id'];
  $title = $_POST['title'];
  $content = $_POST['content'];
  echo $tipController->createTip($plant_id, $title, $content);
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
  // Get tips for a certain plant ID
  if (isset($_GET['plant_id'])) {
    $plant_id = $_GET['plant_id'];
    echo $tipController->getTips($plant_id);
  }
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  // Update a particular tip
  parse_str(file_get_contents("php://input"), $_PUT);
  $tip_id = $_PUT['tip_id'];
  $title = $_PUT['title'];
  $content = $_PUT['content'];
  echo $tipController->updateTip($tip_id, $title, $content);
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  // Delete a particular tip
  parse_str(file_get_contents("php://input"), $_DELETE);
  $tip_id = $_DELETE['tip_id'];
  echo $tipController->deleteTip($tip_id);
}
?>