import { myPlantsData } from "./data.js";
import { getWaterReminder } from "./utils.js";

/**
 * Parses the URL search parameters from the current window location.
 * @type {URLSearchParams}
 */
const urlParameters = new URLSearchParams(window.location.search);

/**
 * Retrieves the "plant_id" parameter from the URL search parameters.
 * @type {string}
 */
const plantId = urlParameters.get("plant_id");

/**
 * Displays the user's plant's water schedule.
 * @param {string} id 
 */
function displayUserPlantWaterSchedule(id) {
  if (!isNaN(id)) {  
    const plant = myPlantsData.find((plant) => plant.id === parseInt(id));
  
    if(plant) {
      const waterScheduleElement = document.getElementById('water-schedule')
      waterScheduleElement.innerText = getWaterReminder(plantId)
    } else {
      window.location.href = "/home.html";
    }
  } else {
    window.location.href = "/home.html";
  }
}

displayUserPlantWaterSchedule(plantId);