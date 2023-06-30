import { SERVER_URL } from "../config.js";

// Function to create a new tip
export function createTip(plant_id, title, content) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/tips_controller.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plant_id: plant_id,
        title: title,
        content: content,
      }),
    })
      .then(response => response.text())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
}

// Function to get tips for a certain plant ID
export function getTips(payload) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/tips_controller.php?action=${payload.action}&plant_id=${payload.plantId}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(result => {
        const data = result.data;
        resolve(data)
      })
      .catch(error => reject(error));
  });
}

// Function to update a particular tip
export function updateTip(tip_id, title, content) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/tips_controller.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tip_id: tip_id,
        title: title,
        content: content,
      }),
    })
      .then(response => response.text())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
}

// Function to delete a particular tip
export function deleteTip(tip_id) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/tips_controller.php`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tip_id: tip_id,
      }),
    })
      .then(response => response.text())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
}
