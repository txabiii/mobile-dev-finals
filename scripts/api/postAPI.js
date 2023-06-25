import { SERVER_URL } from "../config.js";

export function createPost(userId, content) {
  return fetch(`${SERVER_URL}/api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId, content: content }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Post created successfully
      console.log('Post created successfully');
    } else {
      // Failed to create post
      console.log('Failed to create post');
    }
  })
  .catch(error => {
    console.error('Error creating post:', error);
  });
}

export function deletePost(postId) {
  return fetch(`${SERVER_URL}/api/posts?post_id=${postId}`, {
    method: 'DELETE',
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Post deleted successfully
      console.log('Post deleted successfully');
    } else {
      // Failed to delete post
      console.log('Failed to delete post');
    }
  })
  .catch(error => {
    console.error('Error deleting post:', error);
  });
}
