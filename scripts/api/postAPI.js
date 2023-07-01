import { SERVER_URL } from "../config.js";
import { displayResultPopup } from "../utils.js";

export function createPost(payload) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/posts_controller.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const newId = data.newId;
        resolve(newId);
      } else {
        displayResultPopup(data);
        reject();
      }
    })
    .catch(error => {
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
      displayResultPopup(data);
      if (data.success) {
        resolve();
      } else {
        reject();
      }
    })
    .catch(() => {
      displayResultPopup({ success: false, message: 'Failed to delete post' })
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
      reject();
    });
  });
}