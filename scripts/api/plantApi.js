import { SERVER_URL } from "../config.js";
import { displayResultPopup } from "../utils.js";

/**
 * Retrieves all plants by sending a GET request to the server.
 * @returns {Promise<Array<Object>>} A promise that resolves with an array of plant objects if the request is successful, or rejects with an error message if the request fails.
 */
export function getPlant(payload) {
  return new Promise((resolve, reject) => {
    fetch(SERVER_URL + `/api/plants_controller.php?action=${payload.action}&plant_id=${payload.plantId}`)
      .then(response => response.json())
      .then(result => {
        if(!result.success) displayResultPopup(data);
        resolve(result.data)
      }) 
      .catch(error => {        
        displayResultPopup(result);
        reject(error)
      });
  });
}

/**
 * Creates a new plant by sending a POST request to the server.
 * @param {Object} plantData - The data of the plant to be created.
 * @returns {Promise<Object>} A promise that resolves with the created plant object if the request is successful, or rejects with an error message if the request fails.
 */
export function createPlant(plantData) {
  return new Promise((resolve, reject) => {
    fetch('/api/plants_controller.php', {
      method: 'POST',
      body: JSON.stringify(plantData)
    })
    .then(response => response.json())
    .then(data => {      
      displayResultPopup(data);
      resolve(data)
    })
    .catch(error => {        
      displayResultPopup(result);
      reject(error)
    });
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
    fetch(`/api/plants_controller.php/${plantId}`, {
      method: 'PUT',
      body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(data => {      
      displayResultPopup(data);
      resolve(data)
    })
    .catch(error => {
      reject(error)
    });
  });
}

/**
 * Deletes a plant by sending a DELETE request to the server.
 * @param {number} plantId - The ID of the plant to be deleted.
 * @returns {Promise<Object>} A promise that resolves with the result of the deletion if the request is successful, or rejects with an error message if the request fails.
 */
export function deletePlant(plantId) {
  return new Promise((resolve, reject) => {
    fetch(`/api/plants_controller.php/${plantId}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {      
      displayResultPopup(data);
      resolve(data)
    })
    .catch(error => {        
      displayResultPopup(result);
      reject(error)
    });
  });
}
