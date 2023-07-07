<?php
require_once '../db.php';

class ReportsController extends DB {

  public function httpGet() {
    if ($_GET['action'] === 'get-all-reports') {
  
      $query = "SELECT r.id AS report_id, p.content, u_reported.user_id AS reported_user_id, u_reported.username AS reported_username, r.reason, r.reporter_id, u_reporter.username AS reporter_username
                FROM reports_tb r
                INNER JOIN posts_tb p ON p.id = r.post_id
                INNER JOIN user_accounts_tb u_reported ON u_reported.user_id = p.user_id
                INNER JOIN user_accounts_tb u_reporter ON u_reporter.user_id = r.reporter_id";
  
      $result = $this->connection->query($query);
  
      if ($result) {
        $reports = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode(array('success' => true, "message" => "Reports retrieved successfully", "data" => $reports));
      } else {
        echo json_encode(array('success' => false, "message" => "Failed to retrieve reports"));
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
        echo json_encode(array('success' => true, "message" => "Report created successfully"));
      } else {
        echo json_encode(array('success' => false, "message" => "Failed to create report" ));
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
          echo json_encode(array('success' => true, "message" => "Report and post deleted successfully"));
        } else {
          echo json_encode(array('success' => false, "message" => "Failed to delete report"));
        }
      } else {
        echo json_encode(array('success' => false, "message" => "Failed to delete post"));
      }  
      $this->connection->close();
    } elseif ($payload['action'] === 'resolve-report') {

      $report_id = $this->connection->real_escape_string($payload['reportId']);
  
      $query = "DELETE FROM reports_tb WHERE id = '$report_id'";
      $delete_report_result = $this->connection->query($query);
  
      if ($delete_report_result) {
        echo json_encode(array('success' => true, "message" => "Report resolved successfully"));
      } else {
        echo json_encode(array('success' => false, "message" => "Failed to resolve report"));
      }  
      $this->connection->close();
    }
  }
}

$reportsController = new ReportsController();

$received_data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $reportsController->httpGet();
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $reportsController->httpPost($received_data);
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  $reportsController->httpDelete($received_data);
} else {
  echo json_encode(array('success' => false, 'message' => 'Invalid request method'));
}
?>