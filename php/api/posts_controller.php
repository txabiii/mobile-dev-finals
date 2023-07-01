<?php
require_once '../db.php';

class PostsController extends DB {
  public function httpGet() {
    $query = "SELECT p.*, u.profile_image_url, u.username
            FROM posts_tb p 
            JOIN user_accounts_tb u ON p.user_id = u.user_id 
            ORDER BY p.datetime_posted DESC LIMIT 10";

    $result = $this->connection->query($query);
  
    $posts = $result->fetch_all(MYSQLI_ASSOC);
    if ($posts) {
      echo json_encode(array('success' => true, 'message' => 'Posts fetched successfully', 'data' => $posts));
    } else {
      echo json_encode(array('success' => false, 'message' => 'Failed to fetch posts'));
    }
  }

  public function httpPost($payload) {
    $user_id = $payload['userId'];
    $content = $payload['content'];
    $date_time = $payload['dateTime'];

    $query = "INSERT INTO posts_tb (user_id, content, datetime_posted) VALUES (?, ?, ?)";
    $stmt = $this->connection->prepare($query);
    
    $stmt->bind_param("iss", $user_id, $content, $date_time);

    if ($stmt->execute()) {
      $newId = $stmt->insert_id;
      echo json_encode(array('success' => true, 'message' => 'Post created successfully', 'newId' => $newId));
    } else {
      echo json_encode(array('success' => false, 'message' => 'Failed to create post'));
    }
  }

  public function httpDelete() {
    $postId = $_GET['post_id'];

    $query = "DELETE FROM posts_tb WHERE id = ?";
    $stmt = $this->connection->prepare($query);
    
    $stmt->bind_param("i", $postId);
    
    if ($result) {
      echo json_encode(array('success' => true, 'message' => 'Post deleted successfully'));
    } else {
      echo json_encode(array('success' => false, 'message' => 'Failed to delete post'));
    }
  } 
}

$postsController = new PostsController();

$received_data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $postsController->httpGet();
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') { 
  $postsController->httpPost($received_data);
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  $postsController->httpDelete();
} else {
  echo json_encode(array('success' => false, 'message' => 'Invalid request method'));
}
?>
