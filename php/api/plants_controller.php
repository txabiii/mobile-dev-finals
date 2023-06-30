<?php
require_once '../db.php';

class PlantController extends DB {
  public function httpPost($payload) {
    $name = $this->connection->real_escape_string($payload['name']);
    $scientific_name = $this->connection->real_escape_string($payload['scientificName']);
    $watering_frequency = $this->connection->real_escape_string($payload['wateringFrequency']);
    $image_url = $this->connection->real_escape_string($payload['imageUrl']);
    $description = $this->connection->real_escape_string($payload['description']);
    $guide = $this->connection->real_escape_string($payload['guide']);

    $query = "INSERT INTO plants_tb (name, scientific_name, watering_frequency, image_url, description, guide)
    VALUES (?, ?, ?, ?, ?, ?)";

    $stmt = $this->connection->prepare($query);
    $stmt->bind_param("ssisss", $name, $scientific_name, $watering_frequency, $image_url, $description, $guide);

    if ($stmt->execute()) {
      echo json_encode(['message' => 'Plant created successfully']);
    } else {
      echo json_encode(['message' => 'Failed to create plant']);
    }
  }

  public function httpGet() {
    $action = $_GET['action'];

    if($action === 'get-all-plants') {
      $query = "SELECT * FROM plants_tb";
      $result = $this->connection->query($query);

      if ($result) {
        $plants = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode(array("status" => "success", "message" => "Plants retrieved successfully", "data" => $plants));
      } else {
        echo json_encode(array("status" => "error", "message" => "Failed to retrieve plants"));
      }
    } elseif ($action === 'get-specific-plant') {
      $plant_id = $_GET['plant_id'];

      $query = "SELECT * FROM plants_tb WHERE plant_id = ?";
      $stmt = $this->connection->prepare($query);
      $stmt->bind_param("i", $plant_id);
      $stmt->execute();
      $result = $stmt->get_result();
    
      if ($result) {
        $plant = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode(array("status" => "success", "message" => "Plant retrieved successfully", "data" => $plant));
      } else {
        echo json_encode(array("status" => "error", "message" => "Failed to retrieve plant"));
      }
    }
  }  

  public function httpPut($payload) {
    $plant_id = $this->connection->real_escape_string($payload['plantId']);
    $name = $this->connection->real_escape_string($payload['name']);
    $scientific_name = $this->connection->real_escape_string($payload['scientificName']);
    $watering_frequency = $this->connection->real_escape_string($payload['wateringFrequency']);
    $image_url = $this->connection->real_escape_string($payload['imageUrl']);
    $description = $this->connection->real_escape_string($payload['description']);
    $guide = $this->connection->real_escape_string($payload['guide']);

    $query = "UPDATE plants_tb SET name=?, scientific_name=?,
              watering_frequency=?, image_url=?,
              description=?, guide=? WHERE id=?";

    $stmt = $this->connection->prepare($query);
    $stmt->bind_param("ssisssi", $name, $scientific_name, $watering_frequency, $image_url, $description, $guide, $plant_id);

    if ($stmt->execute()) {
      echo json_encode(['message' => 'Plant updated successfully']);
    } else {
      echo json_encode(['message' => 'Failed to update plant']);
    }
  }

  public function httpDelete($payload) {
    $id = $payload['plant_id'];

    $query = "DELETE FROM plants_tb WHERE id=?";

    $stmt = $this->connection->prepare($query);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
      echo json_encode(['message' => 'Plant deleted successfully']);
    } else {
      echo json_encode(['message' => 'Failed to delete plant']);
    }
  }
}

$plantController = new PlantController();

$received_data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $plantController->httpGet();
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $plantController->httpPost($received_data);
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $plantController->httpPut($received_data);
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  $result = $plantController->deletePlant($received_data);
} else {
  http_response_code(405);
  echo json_encode(['message' => 'Invalid request method']);
}
?>