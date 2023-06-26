import { SERVER_URL } from "../config.js";

/**
 * Retrieves all plants by sending a GET request to the server.
 * @returns {Promise<Array<Object>>} A promise that resolves with an array of plant objects if the request is successful, or rejects with an error message if the request fails.
 */
export function getAllPlants() {
  return new Promise((resolve, reject) => {
    fetch(SERVER_URL + '/api/plants')
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(error => reject(error));
  });
}

/**
 * Creates a new plant by sending a POST request to the server.
 * @param {Object} plantData - The data of the plant to be created.
 * @returns {Promise<Object>} A promise that resolves with the created plant object if the request is successful, or rejects with an error message if the request fails.
 */
export function createPlant(plantData) {
  return new Promise((resolve, reject) => {
    fetch('/api/plants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(plantData)
    })
    .then(response => response.json())
    .then(data => resolve(data))
    .catch(error => reject(error));
  });
}

/**
 * Updates a plant by sending a PUT request to the server.
 * @param {number} plantId - The ID of the plant to be updated.
 * @param {Object} updatedData - The updated data of the plant.
 * @returns {Promise<Object>} A promise that resolves with the updated plant object if the request is successful, or rejects with an error message if the request fails.
 */
export function updatePlant(plantId, updatedData) {
  return new Promise((resolve, reject) => {
    fetch(`/api/plants/${plantId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(data => resolve(data))
    .catch(error => reject(error));
  });
}

/**
 * Deletes a plant by sending a DELETE request to the server.
 * @param {number} plantId - The ID of the plant to be deleted.
 * @returns {Promise<Object>} A promise that resolves with the result of the deletion if the request is successful, or rejects with an error message if the request fails.
 */
export function deletePlant(plantId) {
  return new Promise((resolve, reject) => {
    fetch(`/api/plants/${plantId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => resolve(data))
    .catch(error => reject(error));
  });
}
