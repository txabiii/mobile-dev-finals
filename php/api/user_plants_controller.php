<?php
require_once '../db.php';

class UserPlantController extends DB {
  
  public function httpGet() {
    $action = $_GET['action'];
    $user_id = $_GET['user_id'];

    if($action === 'get-all-user-plants') {
      $query = "SELECT up.*, p.name, p.watering_frequency, p.image_url FROM user_plants_tb AS up
      JOIN plants_tb AS p ON up.plant_id = p.plant_id
      WHERE up.id = ? ORDER BY up.datetime_added";

      $stmt = $this->connection->prepare($query);
    
      $stmt->bind_param("i", $user_id);
      
      $stmt->execute();
      
      $result = $stmt->get_result();

      if ($result) {
        $userPlants = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode(array('success' => true, 'message' => 'Plant records retrieved successfully', 'data' => $userPlants));
      } else {
        echo json_encode(array('success' => false, 'message' => 'Failed to retrieve user plant records'));
      }      
      $this->connection->close();

    } elseif($action === 'get-specific-user-plant') {
      $plant_id = $_GET['plant_id'];

      $query = "SELECT up.*, p.* FROM user_plants_tb AS up
      JOIN plants_tb AS p ON up.plant_id = p.plant_id
      WHERE up.id = ? AND p.plant_id = ?";

      $stmt = $this->connection->prepare($query);
          
      $stmt->bind_param("ii", $user_id, $plant_id);

      $stmt->execute();
      
      $result = $stmt->get_result();

      if ($result) {
        $userPlant = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode(array('success' => true, 'message' => 'Plant record retrieved successfully', 'data' => $userPlant));
      } else {
        echo json_encode(array('success' => false, 'message' => 'Failed to retrieve user plant record'));
      }      
      $this->connection->close();
    } elseif('search-user-plants') {
      $query = "SELECT name, p.plant_id, watering_frequency, image_url
                FROM user_plants_tb AS up
                JOIN plants_tb AS p ON up.plant_id = p.plant_id
                where up.id = ? and (name like ? or description like ?)";
      
      $search = '%' . $_GET['search'] . '%';
          
      $stmt = $this->connection->prepare($query);
      $stmt->bind_param("iss", $user_id, $search, $search);
      $stmt->execute();

      $result = $stmt->get_result();

      if ($result) {
          $plants = array();
          while ($row = $result->fetch_assoc()) {
              $plants[] = $row;
          }
          echo json_encode(array('success' => true, "message" => "Searched plants retrieved successfully", "data" => $plants));
      } else {
          echo json_encode(array('success' => false, "message" => "Failed to retrieve plants"));
      }

      $stmt->close();
    }
  }

  public function httpPost($payload) {
    if($payload['action'] === 'create-plant') {
      $plant_id = $payload['plantId'];
      $user_id = $payload['userId'];
      $date_time_added = $payload['dateTime'];

      $query = "INSERT INTO user_plants_tb (id, plant_id, datetime_added) VALUES (?, ?, ?)";

      $stmt = $this->connection->prepare($query);

      $stmt->bind_param("iis", $user_id, $plant_id, $date_time_added);

      if ($stmt->execute()) {
        echo json_encode(array('success' => true, 'message' => 'User plant record created'));
      } else {
        echo json_encode(array('success' => false, 'message' => 'Failed to create user plant record.'));
      }
      $this->connection->close();
    }
  }

  public function httpDelete($payload) {
    if ($payload['action'] === 'delete-user-plant') {
      $plant_id = $payload['plantId'];
      $user_id = $payload['userId'];

      $query = "DELETE FROM user_plants_tb WHERE plant_id = ? AND id = ?";
      $stmt = $this->connection->prepare($query);
      
      $stmt->bind_param("ii", $plant_id, $user_id);
      
      if ($stmt->execute()) {
        echo json_encode(array('success' => true, 'message' => 'User plant record deleted'));
      } else {
        echo json_encode(array('success' => false, 'message' => 'Failed to delete user plant record'));
      }
      $this->connection->close();
    }
  }
}

$userPlantController = new UserPlantController();

$received_data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $userPlantController->httpGet();
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $userPlantController->httpPost($received_data);
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  $userPlantController->httpDelete($received_data);
} else {
  echo json_encode(array('success' => false, "message" => "Invalid request method"));
}
?>