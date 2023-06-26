<?php
require_once '../db.php';

class PostsController extends DB {
  public function getPosts() {
    $sql = "SELECT p.id, p.user_id, u.profile_image_url, u.username, p.content
            FROM posts_tb p 
            JOIN user_accounts_tb u ON p.user_id = u.user_id 
            ORDER BY p.datetime_posted DESC LIMIT 10";

    $result = $this->connection->query($sql);
  
    $posts = array();
    while ($row = $result->fetch_assoc()) {
        $posts[] = $row;
    }
  
    return $posts;
  }

  public function createPost($userId, $content, $datetime) {        
    $sql = "INSERT INTO posts_tb (user_id, content, datetime_posted) VALUES (?, ?, ?)";
    $stmt = $this->connection->prepare($sql);
    
    $stmt->bind_param("iss", $userId, $content, $datetime);
    
    if ($stmt->execute()) {
      return true;
    } else {
      return false;
    }
  }

  public function updatePost($postId, $content) {
    $sql = "UPDATE posts_tb SET content = ? WHERE id = ?";
    $stmt = $this->connection->prepare($sql);
    
    $stmt->bind_param("si", $content, $postId);
    
    if ($stmt->execute()) {
      return true;
    } else {
      return false;
    }
  }
  
  public function deletePost($postId) {
    $sql = "DELETE FROM posts_tb WHERE id = ?";
    $stmt = $this->connection->prepare($sql);
    
    $stmt->bind_param("i", $postId);
    
    if ($stmt->execute()) {
      return true;
    } else {
      return false;
    }
  } 
}

$postsController = new PostsController();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $result = $postsController->getPosts();
  
  if ($result) {
    $response = array('success' => true, 'data' => $result);
    echo json_encode($response);
  } else {
    $response = array('success' => false, 'message' => 'Failed to fetch posts');
    echo json_encode($response);
  }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $postData = json_decode(file_get_contents('php://input'), true);

  $userId = $postData['user_id'];
  $content = $postData['content'];
  $date_time = $postData['dateTime'];
  
  $result = $postsController->createPost($userId, $content, $date_time);
  
  if ($result) {
    $response = array('success' => true, 'message' => 'Post created successfully');
    echo json_encode($response);
  } else {
    $response = array('success' => false, 'message' => 'Failed to create post');
    echo json_encode($response);
  }
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $postId = $_GET['post_id'];
  $content = $_POST['content'];
  
  $result = $postsController->updatePost($postId, $content);
  
  if ($result) {
    $response = array('success' => true, 'message' => 'Post updated successfully');
    echo json_encode($response);
  } else {
    $response = array('success' => false, 'message' => 'Failed to update post');
    echo json_encode($response);
  }
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  $postId = $_GET['post_id'];
  
  $result = $postsController->deletePost($postId);
  
  if ($result) {
    $response = array('success' => true, 'message' => 'Post deleted successfully');
    echo json_encode($response);
  } else {
    $response = array('success' => false, 'message' => 'Failed to delete post');
    echo json_encode($response);
  }
} 
?>
