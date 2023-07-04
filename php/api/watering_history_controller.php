<?php
require '../db.php';

class WateringHistoryController extends DB {

  public function httpPost($payload) {
    $user_id = $this->connection->real_escape_string($payload['userId']);
    $plant_id =  $this->connection->real_escape_string($payload['plantId']);
    $datetime =  $this->connection->real_escape_string($payload['datetime']);

    $query = 'INSERT INTO watering_history_tb (user_id, plant_id, datetime_watered) VALUES (?, ?, ?)';

    $stmt = $this->connection->prepare($query);

    $stmt->bind_param("iis", $user_id, $plant_id, $datetime);

    if ($stmt->execute()) {
      echo json_encode(array('success' => true, 'message' => 'Watering history recorded successfully'));
    } else {
      echo json_encode(array('success' => false, 'message' => 'Failed to record watering history'));
    }
    $this->connection->close();
  }

  public function httpGet() {
    $action = $_GET['action'];

    if($action === 'get-user-watering-history') {
      $user_id = $_GET['userId'];

      $query = 'SELECT * FROM watering_history_tb WHERE user_id = ? ORDER BY datetime_watered DESC';

      $stmt = $this->connection->prepare($query);

      $stmt->bind_param("i", $user_id);

      $stmt->execute();
      
      $result = $stmt->get_result();

      if ($result) {
        $userWateringingHistory = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode(array('success' => true, 'message' => "User's watering history retrieved successfully", 'data' => $userWateringingHistory));
      } else {
        echo json_encode(array('success' => false, 'message' => "Failed to retrieve user's watering history"));
      }      
      $this->connection->close();
      
    } elseif($action === 'get-user-specific-plant-watering-history') {
      $user_id = $_GET['userId'];
      $plant_id = $_GET['plantId'];

      $query = 'SELECT * FROM watering_history_tb WHERE user_id = ? AND plant_id = ?';

      $stmt = $this->connection->prepare($query);

      $stmt->bind_param("ii", $user_id, $plant_id);

      $stmt->execute();
      
      $result = $stmt->get_result();
      if ($result) {
        $userSpecificPlantWateringingHistory = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode(array('success' => true, 'message' => "User's specific plant watering history retrieved successfully", 'data' => $userSpecificPlantWateringingHistory));
      } else {
        echo json_encode(array('success' => false, 'message' => "Failed to retrieve user's specific plant watering history"));
      }      
      $this->connection->close();

    } elseif($action === 'get-all-users-watering-history') {
      $query = 'SELECT * FROM watering_history_tb';
      $result = $this->connection->query($query);

      if ($result) {
        $wateringHistory = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode(array('success' => true, "message" => "Watering history of all users retrieved successfully", "data" => $wateringHistory));
      } else {
        echo json_encode(array('success' => false, "message" => "Failed to retrieve watering history"));
      }
      $this->connection->close();
    } elseif($action === 'get-watering-history-specific-day') {
      $date = $this->connection->real_escape_string($_GET['date']);

      $query = 'SELECT * FROM watering_history_tb WHERE DATE(datetime_watered) = ?';

      $stmt = $this->connection->prepare($query);

      $stmt->bind_param("s", $date);

      $stmt->execute();
      
      $result = $stmt->get_result();
      if ($result) {
        $userWateringingHistory = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode(array('success' => true, 'message' => "Specific day's watering history retrieved successfully", 'data' => $userWateringingHistory));
      } else {
        echo json_encode(array('success' => false, 'message' => "Failed to retrieve specific day's watering history"));
      }      
      $this->connection->close();
    }
  }
}

$wateringHistoryController = new WateringHistoryController();

$received_data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $wateringHistoryController->httpGet();
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') { 
  $wateringHistoryController->httpPost($received_data);
} else {
  echo json_encode(array('success' => false, 'message' => 'Invalid request method'));
}

?>