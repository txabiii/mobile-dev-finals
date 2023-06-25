import { SERVER_URL } from "../config.js";

export function createUserPlant(plantId, userId, dateAdded) {
  return new Promise((resolve, reject) => {
    const data = {
      plant_id: plantId,
      user_id: userId,
      date_added: dateAdded
    };

    fetch(`${SERVER_URL}/api/user-plants`, {
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

export function deleteUserPlant(plantId, userId) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/user-plants/${plantId}/${userId}`, {
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

export function getUserPlants(userId) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/user-plants/${userId}`)
      .then(response => response.json())
      .then(result => {
        if (result.success) {
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
