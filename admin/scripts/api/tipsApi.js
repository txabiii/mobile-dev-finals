import { SERVER_URL } from "../config.js";
import { displayResultPopup } from "../utils.js";

// Function to create a new tip
export function createTip(payload) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/tips_controller.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.text())
      .then(result => {
        resolve(result)
      })
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
        if(!result.success) displayResultPopup(result);
        const data = result.data;
        resolve(data)
      })
      .catch(error => reject(error));
  });
}

// Function to update a particular tip
export function updateTip(payload) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/tips_controller.php?tipId=${payload.tipId}&title=${payload.title}&content=${payload.content}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.text())
      .then(result => {
        resolve(result)
      })
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
        tipId: tip_id,
      }),
    })
      .then(response => response.text())
      .then(result => {
        resolve(result)
      })
      .catch(error => reject(error));
  });
}
