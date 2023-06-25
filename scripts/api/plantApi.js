import { SERVER_URL } from "../config.js";

export function getAllPlants() {
  return new Promise((resolve, reject) => {
    fetch(SERVER_URL + '/api/plants')
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(error => reject(error));
  });
}

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
