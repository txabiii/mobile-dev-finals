import { SERVER_URL } from "../config.js";
import { displayResultPopup } from "../utils.js";

/**
 * Creates new watering history record
 * @param {Object} payload 
 * @returns 
 */
export function createWateringHistory(payload) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/watering_history_controller.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(result => {
      if(!result.success) displayResultPopup(error);
      resolve(result);
    })
    .catch(error => {
      displayResultPopup(error);
      reject(error);
    });
  })
}

/**
 * Retrieves watering history data
 * @param {Object} payload 
 * @returns 
 */
export function getWateringHistory(payload) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/watering_history_controller.php?action=${payload.action}&userId=${payload.userId}&plantId=${payload.plantId}&datetime=${payload.datetime}`)
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          resolve(result.data);
        } else {
          displayResultPopup(result);
          reject(result);
        }
      })
      .catch(error => {
        reject(error.message);
      });
  })
}