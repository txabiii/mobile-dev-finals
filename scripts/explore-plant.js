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
  })
}

displayPlantData(plantId);