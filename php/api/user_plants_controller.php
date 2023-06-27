<?php
require_once '../db.php';

class UserPlantController extends DB {
  
  public function getUserPlants($userId) {
    $sql = "SELECT up.*, p.* FROM user_plants_tb AS up
            JOIN plants_tb AS p ON up.plant_id = p.plant_id
            WHERE up.id = ?";
    $stmt = $this->connection->prepare($sql);
    
    $stmt->bind_param("i", $userId);
    
    $stmt->execute();
    
    $result = $stmt->get_result();
    
    $userPlants = array();
    while ($row = $result->fetch_assoc()) {
      $userPlants[] = $row;
    }
    
    return $userPlants;
  }  
  
  public function createUserPlant($plantId, $userId, $dateAdded) { 
    $sql = "INSERT INTO user_plants_tb (plant_id, user_id, date_added) VALUES (?, ?, ?)";
    $stmt = $this->connection->prepare($sql);
    
    $stmt->bind_param("iis", $plantId, $userId, $dateAdded);
    
    if ($stmt->execute()) {
      return true;
    } else {
      return false;
    }
  }
  
  public function deleteUserPlant($plantId, $userId) {
    $sql = "DELETE FROM user_plants_tb WHERE plant_id = ? AND user_id = ?";
    $stmt = $this->connection->prepare($sql);
    
    $stmt->bind_param("ii", $plantId, $userId);
    
    if ($stmt->execute()) {
      return true;
    } else {
      return false;
    }
  }
}

$userPlantController = new UserPlantController();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $userId = $_GET['user_id'];
  
  $userPlants = $userPlantController->getUserPlants($userId);
  
  if ($userPlants) {
    $response = array('status' => 'success', 'data' => $userPlants);
  } else {
    $response = array('status' => 'fail', 'message' => 'Failed to retrieve user plant records');
  }
  
  echo json_encode($response);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $plantId = $_POST['plant_id'];
  $userId = $_POST['user_id'];
  
  $success = $userPlantController->createUserPlant($plantId, $userId);
  
  if ($success) {
    $response = array('status' => 'success', 'message' => 'User plant record created');
  } else {
    $response = array('status' => 'fail', 'message' => 'Failed to create user plant record');
  }
  
  echo json_encode($response);
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  parse_str(file_get_contents("php://input"), $data);
  $plantId = $data['plant_id'];
  $userId = $data['user_id'];
  
  $success = $userPlantController->deleteUserPlant($plantId, $userId);
  
  if ($success) {
    $response = array('status' => 'success', 'message' => 'User plant record deleted');
  } else {
    $response = array('status' => 'fail', 'message' => 'Failed to delete user plant record');
  }
  
  echo json_encode($response);
}
?>