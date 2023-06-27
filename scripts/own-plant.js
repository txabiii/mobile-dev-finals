import { getWaterReminder } from "./utils.js";
import { getUserPlants } from './api/userPlantsApi.js';
import { getPlant } from "./api/plantApi.js";
import { userData } from './data.js';

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
 * Get user's specific plant
 * Displays the plant data based on the id of the plant.
 * @param {string} id 
 */
getUserPlants(userData.id).then((userPlants) => {
  const parsedId = parseInt(plantId)
  const plant = userPlants.find(item => item.plant_id === parsedId);
  displayPlantData(plant);
})

function displayPlantData(plant) {
  const waterScheduleElement = document.getElementById('water-schedule')
  waterScheduleElement.innerText = getWaterReminder(plant)

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
  plantImageElement.style.visibility = 'visible'
  plantImageElement.src = plant.image_url;
  plantImageElement.alt = `${plant.name}'s image`;

  // Modify the content of the 'height' element
  const heightElement = document.querySelector('#height');
  heightElement.textContent = plant.height;

  // Modify the content of the 'temperature' element
  const temperatureElement = document.querySelector('#temperature');
  temperatureElement.textContent = plant.temperature;

  // Modify the content of the 'container' element
  const containerElement = document.querySelector('#container');
  containerElement.textContent = plant.container;

  // Modify the content of the 'environment' element
  const environmentElement = document.querySelector('#environment');
  environmentElement.textContent = plant.environment;

  // Modify the content of the 'depth' element
  const depthElement = document.querySelector('#depth');
  depthElement.textContent = plant.depth;

  // Modify the content of the 'care' element
  const careElement = document.querySelector('#care');
  careElement.textContent = plant.care;
}