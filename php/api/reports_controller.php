<?php
require_once '../db.php';

class ReportsController extends DB {

  public function httpGet($payload) {
    if ($payload['action'] === 'getReports') {
      $offsetProvided = isset($payload['offset']);
      $limitProvided = isset($payload['limit']);
  
      $query = "SELECT * FROM reports_tb";
  
      if ($offsetProvided && $limitProvided) {
        $offset = intval($payload['offset']);
        $limit = intval($payload['limit']);
        $query .= " LIMIT $limit OFFSET $offset";
      }
  
      $result = $this->connection->query($query);
  
      if ($result) {
        $tips = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode(array("status" => "success", "message" => "Reports retrieved successfully", "data" => $tips));
      } else {
        echo json_encode(array("status" => "error", "message" => "Failed to retrieve reports"));
      }      
      $this->connection->close();
    }
  }  

  public function httpPost($payload) {
    if($payload['action'] === 'submit-report') {
      
      $post_id = $this->connection->real_escape_string($payload['postId']);
      $reporter_id = $this->connection->real_escape_string($payload['reporterId']);
      $reason = $this->connection->real_escape_string($payload['reason']);

      $query = "INSERT INTO reports_tb (post_id, reporter_id, reason) VALUES ('$post_id', '$reporter_id', '$reason')";
      $result = $this->connection->query($query);

      if ($result) { 
        echo json_encode(array( "status" => "success", "message" => "Report created successfully"));
      } else {
        echo json_encode(array( "status" => "error", "message" => "Failed to create report" ));
      }
      $this->connection->close();
    }
  }

  public function httpDelete($payload) {
    if ($payload['action'] === 'delete-reported-post') {
  
      $report_id = $this->connection->real_escape_string($payload['reportId']);
      $post_id = $this->connection->real_escape_string($payload['postId']);
  
      $query = "DELETE FROM posts_tb WHERE id = '$post_id'";
      $delete_post_result = $this->connection->query($query);
  
      if ($delete_post_result) {
        $query = "DELETE FROM reports_tb WHERE id = '$report_id'";
        $delete_report_result = $this->connection->query($query);
  
        if ($delete_report_result) {
          echo json_encode(array("status" => "success", "message" => "Report and post deleted successfully"));
        } else {
          echo json_encode(array("status" => "error", "message" => "Failed to delete report"));
        }
      } else {
        echo json_encode(array("status" => "error", "message" => "Failed to delete post"));
      }  
      $this->connection->close();
    } elseif ($payload['action'] === 'resolve-report') {

      $report_id = $this->connection->real_escape_string($payload['reportId']);
  
      $query = "DELETE FROM reports_tb WHERE id = '$report_id'";
      $delete_report_result = $this->connection->query($query);
  
      if ($delete_report_result) {
        echo json_encode(array("status" => "success", "message" => "Report resolved successfully"));
      } else {
        echo json_encode(array("status" => "error", "message" => "Failed to resolve report"));
      }  
      $this->connection->close();
    }
  }
}

$reportsController = new ReportsController();

$received_data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $reportsController->httpPost($received_data);
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  $reportsController->httpDelete($received_data);
} else {
  echo json_encode( array("status" => "error", "message" => "Invalid request method"));
}