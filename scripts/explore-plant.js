import { getPlant } from './api/plantApi.js';

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
  getPlant(id).then((plants) => {
    const plant = plants[0];

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
  
    const plantImageElement = document.getElementById('plant-image');
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
  })
}

displayPlantData(plantId);