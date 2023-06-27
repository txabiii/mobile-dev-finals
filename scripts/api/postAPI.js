import { SERVER_URL } from "../config.js";

export function createPost(userId, content, dateTime) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/posts_controller.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, content: content, dateTime: dateTime}),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Post created successfully');
        resolve();
      } else {
        console.log('Failed to create post');
        reject();
      }
    })
    .catch(error => {
      console.error('Error creating post:', error);
      reject();
    });
  });
}

export function deletePost(postId) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/posts_controller.php?post_id=${postId}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Post deleted successfully
        console.log('Post deleted successfully');
        resolve();
      } else {
        // Failed to delete post
        console.log('Failed to delete post');
        reject();
      }
    })
    .catch(error => {DEFAULT_LIMIT
      console.error('Error deleting post:', error);
      reject();
    });
  });
}

export function getPosts() {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/posts_controller.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      const posts = data.data;
      resolve({ posts });
    })
    .catch(error => {
      console.error('Error retrieving posts:', error);
      reject();
    });
  });
}