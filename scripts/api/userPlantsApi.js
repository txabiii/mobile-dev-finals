import { SERVER_URL } from "../config.js";
import { displayResultPopup } from "../utils.js";

/**
 * Creates a user plant record by sending a POST request to the server.
 * @param {number} plantId - The ID of the plant to associate with the user.
 * @param {number} userId - The ID of the user.
 * @param {string} dateAdded - The date when the plant was added by the user.
 * @returns {Promise<string>} A promise that resolves with a success message if the request is successful, or rejects with an error message if the request fails.
 */
export function createUserPlant(payload) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/user_plants_controller.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(result => {
      displayResultPopup(result);
      resolve(result.message);
    })
    .catch(() => {
      displayResultPopup({
        success: false,
        message: 'Failed to add this plant.'
      });
    });
  });
}

/**
 * Deletes a user plant record by sending a DELETE request to the server.
 * @param {number} plantId - The ID of the plant to delete from the user's plants.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<string>} A promise that resolves with a success message if the request is successful, or rejects with an error message if the request fails.
 */
export function deleteUserPlant(payload) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/user_plants_controller.php`, {
      method: 'DELETE',
      body: JSON  .stringify(payload)
    })
    .then(response => response.json())
    .then(result => {
      displayResultPopup(result);
      resolve(result)
    })
    .catch(error => {
      reject(error);
    });
  });
}

/**
 * Retrieves the user's plants by sending a GET request to the server.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array<Object>>} A promise that resolves with an array of user plant objects if the request is successful, or rejects with an error message if the request fails.
 */
export function getUserPlants(payload) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/user_plants_controller.php?action=${payload.action}&user_id=${payload.userId}&plant_id=${payload.plantId}`)
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          resolve(result.data);
        } else {
          displayResultPopup(result);
          reject(result.message);
        }
      })
      .catch(error => {
        reject(error.message);
      });
  });
}
