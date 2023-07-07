<?php
require_once '../db.php';

class ReportsController extends DB {

  public function httpGet() {
    if ($_GET['action'] === 'get-all-reports') {
      $status = $_GET['status'] ?? ''; // Get the optional "status" parameter from the query string
      $dateRange = $_GET['date_range'] ?? ''; // Get the optional "date_range" parameter from the query string
      $reportId = $_GET['report_id'] ?? ''; // Get the optional "report_id" parameter from the query string
    
      $query = "SELECT r.id AS report_id, p.content, u_reported.user_id AS reported_user_id, u_reported.username AS reported_username, r.reason, r.reporter_id, u_reporter.username AS reporter_username
                FROM reports_tb r
                INNER JOIN posts_tb p ON p.id = r.post_id
                INNER JOIN user_accounts_tb u_reported ON u_reported.user_id = p.user_id
                INNER JOIN user_accounts_tb u_reporter ON u_reporter.user_id = r.reporter_id";
    
      $conditions = []; // Array to hold the conditions for the query
    
      // Add conditions based on the provided "status", "date_range", and "report_id" values
      if ($status !== 'null') {
        $conditions[] = "r.resolved = " . ($status === 'true' ? '1' : '0'); // Assuming "resolved" column stores 1 for true and 0 for false
      }
      if ($dateRange !== 'null') {
        $startDate = '';
        $endDate = '';
    
        // Determine the start and end dates based on the provided "date_range" value
        switch ($dateRange) {
          case 'today':
            $startDate = date('Y-m-d');
            $endDate = date('Y-m-d');
            break;
          case 'last_7_days':
            $startDate = date('Y-m-d', strtotime('-7 days'));
            $endDate = date('Y-m-d');
            break;
          case 'last_30_days':
            $startDate = date('Y-m-d', strtotime('-30 days'));
            $endDate = date('Y-m-d');
            break;
          default:
            break;
        }
    
        if (!empty($endDate)) {
          $conditions[] = "r.datetime_reported >= '$startDate' AND r.datetime_reported <= '$endDate'";
        }
      }
      
      if ($reportId !== 'null') {
        $conditions[] = "r.id = '$reportId'";
      }
    
      // Append the conditions to the query if there are any
      if (!empty($conditions)) {
        $query .= ' WHERE ' . implode(' AND ', $conditions);
      }
    
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

  public function httpPut($payload) {
    $action = $payload['action'];

    if($action === 'resolve-report') {
      $reportId = $payload['id'] ?? null;
  
      if ($reportId !== null) {
        $query = "UPDATE reports_tb SET resolved = 1 WHERE id = $reportId";
        $result = $this->connection->query($query);
    
        if ($result) {
          echo json_encode(array('success' => true, "message" => "Report updated successfully"));
        } else {
          echo json_encode(array('success' => false, "message" => "Failed to update report"));
        }
      } else {
        echo json_encode(array('success' => false, "message" => "Invalid report ID"));
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
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $reportsController->httpPut($received_data);
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  $reportsController->httpDelete($received_data);
} else {
  echo json_encode(array('success' => false, 'message' => 'Invalid request method'));
}
?>