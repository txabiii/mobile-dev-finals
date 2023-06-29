import { SERVER_URL } from "../config.js";

// Function to create a new report
export function createReport(postId, reporterId, reason) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/reports_controller.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        post_id: postId,
        reporter_id: reporterId,
        reason: reason
      })
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

// Function to delete a report
export function deleteReport(reportId) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/reports_controller.php?report_id=${reportId}`, {
      method: 'DELETE'
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
