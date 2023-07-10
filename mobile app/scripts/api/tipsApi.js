import { SERVER_URL } from "../config.js";
import { displayResultPopup } from "../utils.js";

// Function to create a new tip
export function createTip(plant_id, title, content) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/tips_controller.php`, {
      method: 'POST',
      body: JSON.stringify({
        plant_id: plant_id,
        title: title,
        content: content,
      }),
    })
      .then(response => response.text())
      .then(result => {
        displayResultPopup(result);
        resolve(result)
      })
      .catch(error => reject(error));
  });
}

// Function to get tips for a certain plant ID
export function getTips(payload) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/tips_controller.php?action=${payload.action}&plant_id=${payload.plantId}`)
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
export function updateTip(tip_id, title, content) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/tips_controller.php`, {
      method: 'PUT',
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
      body: JSON.stringify({
        tip_id: tip_id,
      }),
    })
      .then(response => response.text())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
}
