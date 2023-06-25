<?php
require_once '../db.php';

class PlantController extends DB {
  public function createPlant($name, $scientificName, $wateringFrequency, $imageUrl, $description, $guide) {
      $name = $this->connection->real_escape_string($name);
      $scientificName = $this->connection->real_escape_string($scientificName);
      $imageUrl = $this->connection->real_escape_string($imageUrl);
      $description = $this->connection->real_escape_string($description);
      $guide = $this->connection->real_escape_string($guide);

      $query = "INSERT INTO plants (name, scientific_name, watering_frequency, image_url, description, guide)
                VALUES ('$name', '$scientificName', '$wateringFrequency', '$imageUrl', '$description', '$guide')";

      if ($this->connection->query($query) === TRUE) {
          return true;
      } else {
          return false;
      }
  }

  public function getAllPlants() {
      $query = "SELECT * FROM plants";
      $result = $this->connection->query($query);

      $plants = [];
      if ($result->num_rows > 0) {
          while ($row = $result->fetch_assoc()) {
              $plants[] = $row;
          }
      }

      return $plants;
  }

  public function updatePlant($id, $name, $scientificName, $wateringFrequency, $imageUrl, $description, $guide) {
      $name = $this->connection->real_escape_string($name);
      $scientificName = $this->connection->real_escape_string($scientificName);
      $imageUrl = $this->connection->real_escape_string($imageUrl);
      $description = $this->connection->real_escape_string($description);
      $guide = $this->connection->real_escape_string($guide);

      $query = "UPDATE plants SET name='$name', scientific_name='$scientificName',
                watering_frequency='$wateringFrequency', image_url='$imageUrl',
                description='$description', guide='$guide' WHERE id=$id";

      if ($this->connection->query($query) === TRUE) {
          return true;
      } else {
          return false;
      }
  }

  public function removePlant($id) {
      $query = "DELETE FROM plants WHERE id=$id";

      if ($this->connection->query($query) === TRUE) {
          return true;
      } else {
          return false;
      }
  }
}

$plantController = new PlantController();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $plants = $plantController->getAllPlants();
  echo json_encode($plants);
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