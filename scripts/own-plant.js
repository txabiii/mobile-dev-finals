import { myPlantsData, allPlantsData } from "./data.js";
import { getWaterReminder } from "./utils.js";

/**
 * The image element for returning back.
 * @type {HTMLElement}
 */
const goBackImage = document.getElementById("go-back-image");

/**
 * Adds an event listener to the goBackImage element, which navigates to the home page when clicked.
 */
goBackImage.addEventListener("click", function() {
  window.location.href = "/home.html";
});

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
 * Displays the plant data based on the id of the plant.
 * @param {string} id 
 */
function displayPlantData(id) {
  if (!isNaN(id)) {  
    const plant = allPlantsData.find((plant) => plant.id === parseInt(id));
  
    if (plant) {
      const plantNameElement = document.getElementById('plant-name');
      plantNameElement.innerText = plant.name;
  
      const scientificNameElement = document.getElementById('scientific-name');
      scientificNameElement.innerText = plant.scientific_name;
  
      const waterFrequencyElement = document.getElementById('water-frequency');
      if(plant.watering_frequency === 1) 
      waterFrequencyElement.textContent = 'Water everyday'
      else waterFrequencyElement.textContent = `Water every ${plant.watering_frequency} days`;
  
      const plantDescriptionElement = document.getElementById('plant-description');
      plantDescriptionElement.innerText = plant.description;
  
      const plantGuideLabelElement = document.getElementById('plant-guide-label');
      plantGuideLabelElement.innerText = `How to take care (${plant.name})`;
  
      const plantGuideElement = document.getElementById('plant-guide');
      plantGuideElement.innerText = plant.guide;
  
      const plantImageElement = document.getElementById('plant-image');
      plantImageElement.src = plant.image_url;
      plantImageElement.alt = `${plant.name}'s image`;
    } else {
      window.location.href = "/home.html";
    }
  } else {
    window.location.href = "/home.html";
  }  
}

displayPlantData(plantId);

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