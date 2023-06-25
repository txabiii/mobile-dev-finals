import { SERVER_URL } from "../config";

export function getAllPlants() {
  return $.ajax({
    url: SERVER_URL + '/api/plants',
    method: 'GET',
    dataType: 'json'
  });
}

export function createPlant(plantData) {
  return $.ajax({
    url: '/api/plants',
    method: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(plantData)
  });
}

// Remind to self: Sa Admin app lang applicable itong operations na ito. The end-user will not delete or edit the overall plants

// // Function to update a plant
// function updatePlant(plantId, updatedData) {
//   return $.ajax({
//     url: `/api/plants/${plantId}`,
//     method: 'PUT',
//     dataType: 'json',
//     contentType: 'application/json',
//     data: JSON.stringify(updatedData)
//   });
// }

// // Function to delete a plant
// function deletePlant(plantId) {
//   return $.ajax({
//     url: `/api/plants/${plantId}`,
//     method: 'DELETE',
//     dataType: 'json',
//     contentType: 'application/json'
//   });
// }
