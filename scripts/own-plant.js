import { getWaterReminder } from "./utils.js";
import { getUserPlants } from './api/userPlantsApi.js';
import { userData } from './data.js';
import { getTips } from "./api/tipsApi.js";

/**
 * The image element for returning back.
 * @type {HTMLElement}
 */
const goBackImage = document.getElementById("go-back-image");

/**
 * Adds an event listener to the goBackImage element, which navigates to the home page when clicked.
 */
goBackImage.addEventListener("click", function() {
  window.location.href = "home.html";
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
 * then call 'displayUserPlants' to show the plant's datas
 * @param {string} id 
 */
getUserPlants(userData.id).then((userPlants) => {
  const plantOverviewLoadingPlaceholder = document.querySelector('#plant-overview-loading');
  plantOverviewLoadingPlaceholder.style.display = 'none';
  
  const plantGuideLoadingPlaceholder = document.querySelector('#plant-guide-loading');
  plantGuideLoadingPlaceholder.style.display = 'none';

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

  const plantTipLabelElement = document.getElementById('plant-tip-label');
  plantTipLabelElement.innerText = `${plant.name} tips`;

  const plantGuideLabelElement = document.getElementById('plant-guide-label');
  plantGuideLabelElement.innerText = `How to take care of ${plant.name}`;

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

/**
 * Fetch tips and populate the template
 * @param {plantId} number
 */
getTips(plantId)
  .then(data => {
    const tipTemplate = document.getElementById('tip-template');
    const tipsList = document.getElementById('tips-list');
    const dotGroup = document.getElementById('dot-group');
    
    for (const [index, tipData] of data.entries()) {
      const tipElement = tipTemplate.content.cloneNode(true);
    
      // Fill in the tip data
      const titleElement = tipElement.querySelector('h4');
      const contentElement = tipElement.querySelector('p');
    
      titleElement.textContent = tipData.title;
      contentElement.textContent = tipData.content;
    
      tipsList.appendChild(tipElement);
    
      const dotElement = document.createElement('div');
      dotElement.classList.add('dot');
      dotElement.setAttribute('data-index', index); // Add data attribute for index
      dotElement.addEventListener('click', () => {
        const clickedIndex = parseInt(dotElement.getAttribute('data-index'));
    
        // Calculate scroll position based on tip container width and dot index
        const tipContainerWidth = tipsList.offsetWidth;
        const scrollPosition = tipContainerWidth * clickedIndex;
        tipsList.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
    
        // Change opacity of dots
        const allDots = document.querySelectorAll('.dot');
        allDots.forEach(dot => {
          dot.style.opacity = dot === dotElement ? '1' : '0.5';
        });
      });
    
      dotGroup.appendChild(dotElement);
    }
    
    const allDots = dotGroup.querySelectorAll('.dot');
    tipsList.addEventListener('scroll', debounce(() => {
      const visibleTipIndex = Math.round(tipsList.scrollLeft / tipsList.offsetWidth);

      allDots.forEach((dot, index) => {
        dot.style.opacity = index === visibleTipIndex ? '1' : '0.5';
      });
    }, 300));
  })
  .catch(error => {
    console.error('Error fetching tips:', error);
  });


function debounce(func, delay) {
  let timer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}