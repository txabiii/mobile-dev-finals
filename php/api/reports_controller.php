<?php
require_once '../db.php';

class ReportsController extends DB {

  // Function to create a new report
  public function createReport($post_id, $reporter_id, $reason) {
    // Sanitize input values to prevent SQL injection
    $post_id = $this->conn->real_escape_string($post_id);
    $reporter_id = $this->conn->real_escape_string($reporter_id);
    $reason = $this->conn->real_escape_string($reason);

    // Insert the report into the table
    $query = "INSERT INTO reports_tb (post_id, reporter_id, reason) VALUES ('$post_id', '$reporter_id', '$reason')";
    $result = $this->conn->query($query);

    // Check if the insertion was successful
    if ($result) {
      $response = array(
        "status" => "success",
        "message" => "Report created successfully"
      );
    } else {
      $response = array(
        "status" => "error",
        "message" => "Failed to create report"
      );
    }

    // Convert the response array to JSON
    $json_response = json_encode($response);

    // Return the JSON response
    return $json_response;
  }

  // Function to delete a report
  public function deleteReport($report_id) {
    // Sanitize input value to prevent SQL injection
    $report_id = $this->conn->real_escape_string($report_id);

    // Delete the report from the table
    $query = "DELETE FROM reports_tb WHERE id = '$report_id'";
    $result = $this->conn->query($query);

    // Check if the deletion was successful
    if ($result) {
      $response = array(
        "status" => "success",
        "message" => "Report deleted successfully"
      );
    } else {
      $response = array(
        "status" => "error",
        "message" => "Failed to delete report"
      );
    }

    // Convert the response array to JSON
    $json_response = json_encode($response);

    // Return the JSON response
    return $json_response;
  }
}

$reportsController = new ReportsController();

// Check the request method
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  // Handle GET request
  // Call the appropriate function here, e.g., $reportsController->getReports();
  
  // Placeholder JSON response for demonstration
  $response = array(
    "status" => "success",
    "message" => "GET request received"
  );
  echo json_encode($response);
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  // Handle DELETE request
  // Retrieve the report ID from the request, e.g., $_GET['report_id']
  $report_id = $_GET['report_id'];
  // Call the deleteReport function and return the JSON response
  echo $reportsController->deleteReport($report_id);
} else {
  // Invalid request method
  $response = array(
    "status" => "error",
    "message" => "Invalid request method"
  );
  echo json_encode($response);
}