import { getPlant } from './api/plantApi.js';
import { createUserPlant } from './api/userPlantsApi.js';
import { userData } from './data.js';
import { generateDateTime, toggleAddPlants } from './utils.js';

/**
 * Select add plant buttons and add the `toggleAddPlants` event
 */
Array.from(document.getElementsByClassName("add-plant-button"))
  .forEach(button => button.addEventListener("click", toggleAddPlants));

/**
 * The image element for returning back.
 * @type {HTMLElement}
 */
const goBackImage = document.getElementById("go-back-image");

/**
 * Adds an event listener to the goBackImage element, which navigates to the home page when clicked.
 */
goBackImage.addEventListener("click", function() {
  window.history.back();
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
  getPlant({
    action: 'get-specific-plant',
    plantId: id
  }).then((plants) => {
    const plant = plants[0];
      
    const plantOverviewLoadingPlaceholder = document.querySelector('#plant-overview-loading');
    plantOverviewLoadingPlaceholder.style.display = 'none';

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
    plantImageElement.style.visibility = 'visible'

    const heightElement = document.querySelector('#height');
    heightElement.textContent = plant.height;

    const temperatureElement = document.querySelector('#temperature');
    temperatureElement.textContent = plant.temperature;

    const containerElement = document.querySelector('#container');
    containerElement.textContent = plant.container;

    const environmentElement = document.querySelector('#environment');
    environmentElement.textContent = plant.environment;

    const depthElement = document.querySelector('#depth');
    depthElement.textContent = plant.depth;

    const careElement = document.querySelector('#care');
    careElement.textContent = plant.care; 

    const shoplabelElement = document.querySelector('#shop-label');
    shoplabelElement.textContent = `Shop for ${plant.name}`

    const addPlantButton = document.querySelector('#add-plant-button');
    addPlantButton.addEventListener("click", () => {
      createUserPlant({
        action: 'create-plant',
        plantId: plant.plant_id,
        userId: userData.id,
        dateTime: generateDateTime()
      })
    })

    addShopClickEvents(plant.name);
  })
}

displayPlantData(plantId);

/**
 * @type {boolean} indicates whether shop links are shown or not
 */
let showShopIcons = false;

/**
 * @type {HTMLElement}
 */
const shopElement = document.querySelector('.shop');
const shopLabelElement = document.querySelector('#shop-label');
const shopIcons = document.querySelector('.shop-icons');

/**
 * @type {Event}
 */
shopLabelElement.addEventListener("click", () => {
  if(showShopIcons) {
    shopIcons.style.display = 'none';
    shopElement.style.borderRadius = '0px';
    shopElement.style.position = 'unset';
    shopElement.style.bottom = 'unset';
    shopElement.style.widows = 'unset';
    shopElement.style.height = '70px';
  } else {
    shopIcons.style.display = 'flex';
    shopElement.style.position = 'absolute';
    shopElement.style.borderRadius = '40px 40px 0px 0px';
    shopElement.style.bottom = '0px';
    shopElement.style.width = '100%';
    shopElement.style.height = '177px';
  }
  showShopIcons = !showShopIcons;
});

/**
 * Shop icons
 * @type {HTMLElement}
 */
const lazadaIcon = document.querySelector('#lazada-icon');
const shopeeIcon = document.querySelector('#shopee-icon');
const shopLeafIcon = document.querySelector('#shop-leaf-icon');
const spruceIcon = document.querySelector('#spruce-icon');

/**
 * Add click events for each of the shop links
 */
function addShopClickEvents(plantName) {
  let preparedPlantName = plantName.toLowerCase();
  if(!preparedPlantName.includes('plant')) preparedPlantName += ' plant';

  lazadaIcon.addEventListener("click", () => {
    window.open(`https://www.lazada.com.ph/tag/${preparedPlantName.replace(/\s/g, "-")}`, '_blank')
  })

  shopeeIcon.addEventListener("click", () => {
    window.open(`https://shopee.ph/search?keyword=${preparedPlantName.replace(/\s/g, "%20")}`, '_blank')
  })

  shopLeafIcon.addEventListener("click", () => {
    window.open(`https://shopleaf.ph/search?q=${preparedPlantName.replace(/\s/g, "+")}`, '_blank')
  })

  spruceIcon.addEventListener("click", () => {
    window.open(`https://spruceplantshop.com/search?q=${preparedPlantName.replace(/\s/g, "+")}`, '_blank')
  })
}