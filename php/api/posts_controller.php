<?php
require_once '../db.php';

class PostsController extends DB {
    public function createPost($userId, $content, $datetimePosted) {        
        $sql = "INSERT INTO posts_tb (user_id, content, datetime_posted) VALUES (?, ?, ?)";
        $stmt = $this->connection->prepare($sql);
        
        $stmt->bind_param("iss", $userId, $content, $datetimePosted);
        
        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function getPosts($limit = null, $offset = null) {
      $sql = "SELECT * FROM posts_tb ORDER BY datetime_posted DESC";
    
      if ($limit !== null && $offset !== null) {
        $sql .= " LIMIT ?, ?";
        $stmt = $this->connection->prepare($sql);
        $stmt->bind_param("ii", $offset, $limit);
        $stmt->execute();
        $result = $stmt->get_result();
      } else {
        $result = $this->connection->query($sql);
      }
    
      $posts = array();
      while ($row = $result->fetch_assoc()) {
        $posts[] = $row;
      }
    
      return $posts;
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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $userId = $_POST['user_id'];
  $content = $_POST['content'];
  
  $result = $postsController->createPost($userId, $content);
  
  if ($result) {
      $response = array('success' => true, 'message' => 'Post created successfully');
      echo json_encode($response);
  } else {
      $response = array('success' => false, 'message' => 'Failed to create post');
      echo json_encode($response);
  }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
  if (isset($_GET['limit']) && isset($_GET['offset'])) {
      $limit = $_GET['limit'];
      $offset = $_GET['offset'];
  } else {
      $limit = null;
      $offset = null;
  }
  
  $result = $postsController->getPosts($limit, $offset);
  
  if ($result) {
      $response = array('success' => true, 'data' => $result);
      echo json_encode($response);
  } else {
      $response = array('success' => false, 'message' => 'Failed to fetch posts');
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
