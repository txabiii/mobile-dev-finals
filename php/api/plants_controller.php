<?php
require_once '../db.php';

class PlantController extends DB {
  public function createPlant($name, $scientificName, $wateringFrequency, $imageUrl, $description, $guide) {
    $query = "INSERT INTO plants_tb (name, scientific_name, watering_frequency, image_url, description, guide)
              VALUES (?, ?, ?, ?, ?, ?)";

    $stmt = $this->connection->prepare($query);
    $stmt->bind_param("ssisss", $name, $scientificName, $wateringFrequency, $imageUrl, $description, $guide);
    
    if ($stmt->execute()) {
      return true;
    } else {
      return false;
    }
  }

  public function getPlant($plantId = null) {
    $query = "SELECT * FROM plants_tb";
  
    if ($plantId !== null) {
      $query .= " WHERE plant_id = ?";
      $stmt = $this->connection->prepare($query);
      $stmt->bind_param("i", $plantId);
      $stmt->execute();
      $result = $stmt->get_result();
    } else {
      $result = $this->connection->query($query);
    }
  
    $plants = [];
    if ($result->num_rows > 0) {
      while ($row = $result->fetch_assoc()) {
        $plants[] = $row;
      }
    }
  
    return $plants;
  }  

  public function updatePlant($id, $name, $scientificName, $wateringFrequency, $imageUrl, $description, $guide) {
    $query = "UPDATE plants_tb SET name=?, scientific_name=?,
              watering_frequency=?, image_url=?,
              description=?, guide=? WHERE id=?";

    $stmt = $this->connection->prepare($query);
    $stmt->bind_param("ssisssi", $name, $scientificName, $wateringFrequency, $imageUrl, $description, $guide, $id);
    
    if ($stmt->execute()) {
      return true;
    } else {
      return false;
    }
  }

  public function removePlant($id) {
    $query = "DELETE FROM plants_tb WHERE id=?";

    $stmt = $this->connection->prepare($query);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
      return true;
    } else {
      return false;
    }
  }
}

$plantController = new PlantController();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  if (isset($_GET['plant_id']) && $_GET['plant_id'] !== "null") {
      $plantId = $_GET['plant_id'];
      $plant = $plantController->getPlant($plantId);
      
      if ($plant) {
          echo json_encode($plant);
      } else {
          http_response_code(404);
          echo json_encode(['message' => 'Plant not found']);
      }
  } else {
      $plants = $plantController->getPlant();
      if($plants) {
        echo json_encode($plants);
      } else {
        http_response_code(404);
        echo json_encode(['message' => 'Plant not found']);
      }
  }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $requestData = json_decode(file_get_contents('php://input'), true);
  $result = $plantController->createPlant(
      $requestData['name'],
      $requestData['scientific_name'],
      $requestData['watering_frequency'],
      $requestData['image_url'],
      $requestData['description'],
      $requestData['guide']
  );

  if ($result) {
      echo json_encode(['message' => 'Plant created successfully']);
  } else {
      http_response_code(500);
      echo json_encode(['message' => 'Failed to create plant']);
  }
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $requestData = json_decode(file_get_contents('php://input'), true);
  $result = $plantController->updatePlant(
      $requestData['id'],
      $requestData['name'],
      $requestData['scientific_name'],
      $requestData['watering_frequency'],
      $requestData['image_url'],
      $requestData['description'],
      $requestData['guide']
  );

  if ($result) {
      echo json_encode(['message' => 'Plant updated successfully']);
  } else {
      http_response_code(500);
      echo json_encode(['message' => 'Failed to update plant']);
  }
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  $requestData = json_decode(file_get_contents('php://input'), true);
  $result = $plantController->deletePlant($requestData['id']);

  if ($result) {
      echo json_encode(['message' => 'Plant deleted successfully']);
  } else {
      http_response_code(500);
      echo json_encode(['message' => 'Failed to delete plant']);
  }
} else {
  http_response_code(405);
  echo json_encode(['message' => 'Invalid request method']);
}
?>