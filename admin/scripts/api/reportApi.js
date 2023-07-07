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
      headers: {
        'Content-Type': 'application/json'
      },
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
      headers: {
        'Content-Type': 'application/json'
      },
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
  console.log(payload)
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/reports_controller.php?action=${payload.action}&status=${payload.status}&date_range=${payload.dateRange}&report_id=${payload.reportId}`)
    .then(response => response.json())
    .then(data => {
      const report = data.data;
      resolve({ report });
    })
    .catch(error => {
      reject(error);
    });
  });
}

export function updateReport(payload) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/reports_controller.php?action=${payload.action}&id=${payload.reportId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
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
