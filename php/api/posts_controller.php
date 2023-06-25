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
