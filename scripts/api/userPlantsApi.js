import { SERVER_URL } from "../config.js";

/**
 * Creates a user plant record by sending a POST request to the server.
 * @param {number} plantId - The ID of the plant to associate with the user.
 * @param {number} userId - The ID of the user.
 * @param {string} dateAdded - The date when the plant was added by the user.
 * @returns {Promise<string>} A promise that resolves with a success message if the request is successful, or rejects with an error message if the request fails.
 */
export function createUserPlant(plantId, userId, dateAdded) {
  return new Promise((resolve, reject) => {
    const data = {
      plant_id: plantId,
      user_id: userId,
      date_added: dateAdded
    };

    fetch(`${SERVER_URL}/api/user_plants_controller.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        resolve(result.message);
      } else {
        reject(result.message);
      }
    })
    .catch(error => {
      reject(error.message);
    });
  });
}

/**
 * Deletes a user plant record by sending a DELETE request to the server.
 * @param {number} plantId - The ID of the plant to delete from the user's plants.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<string>} A promise that resolves with a success message if the request is successful, or rejects with an error message if the request fails.
 */
export function deleteUserPlant(plantId, userId) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/user_plants_controller.php/${plantId}/${userId}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        resolve(result.message);
      } else {
        reject(result.message);
      }
    })
    .catch(error => {
      reject(error.message);
    });
  });
}

/**
 * Retrieves the user's plants by sending a GET request to the server.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array<Object>>} A promise that resolves with an array of user plant objects if the request is successful, or rejects with an error message if the request fails.
 */
export function getUserPlants(userId) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/user_plants_controller.php?user_id=${userId}`)
      .then(response => response.json())
      .then(result => {
        if (result.status === 'success') {
          resolve(result.data);
        } else {
          reject(result.message);
        }
      })
      .catch(error => {
        reject(error.message);
      });
  });
}
