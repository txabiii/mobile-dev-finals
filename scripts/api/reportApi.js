import { SERVER_URL } from "../config.js";
import { displayResultPopup } from "../utils.js";

/**
 * Creates a report for a post.
 * @param {object} payload 
 * @returns {Promise} A promise that resolves to the API response.
 */
export function createReport(payload) {
  return new Promise((resolve, reject) => {

    fetch(`${SERVER_URL}/api/reports_controller.php`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(data => {
        displayResultPopup(data);
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

/**
 * Deletes a report or a reported post based on the payload action.
 * @param {Object} payload - The payload object containing the report details and action.
 * @returns {Promise} A promise that resolves to the API response.
 */
export function deleteReport(payload) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/reports_controller.php`, {
      method: 'DELETE',
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function getReports(payload) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/posts_controller.php?action=${payload.action}`)
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