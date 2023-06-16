import { baseUrl } from './config.js';
import { allPlantsData } from './data.js';

const goBackImage = document.getElementById("go-back-image");

goBackImage.addEventListener("click", function() {
  window.location.href = baseUrl + "/index.html";
});

const urlParameters = new URLSearchParams(window.location.search);

const plantId = urlParameters.get("plant_id");

if (!isNaN(plantId)) {
  const parsedPlantId = parseInt(plantId);

  const plant = allPlantsData.find((plant) => plant.id === parsedPlantId);

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
    window.location.href = baseUrl + "/index.html";
  }
} else {
  window.location.href = baseUrl + "/index.html";
}

