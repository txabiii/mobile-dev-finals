import { toggleAddPlants, getNextWateringTime, getFormattedTime, getWaterReminder } from "./utils.js";
import { getUserPlants } from "./api/userPlantsApi.js";
import { userData } from "./data.js";

/**
 * Select add plant buttons and add the `toggleAddPlants` event
 */
Array.from(document.getElementsByClassName('add-plant-button'))
  .forEach(button => button.addEventListener('click', toggleAddPlants));

// Time basis
const anHour = 60 * 60 * 1000;
const aDay = 24 * 60 * 60 * 1000;
const aWeek = 24 * 60 * 60 * 1000 * 7;

// HTML elements where to insert the plant's HTML display
const plantsToday = document.getElementById("plants-today");
const plantsNextSevenDays = document.getElementById("plants-next-seven-days");
const plantsBeyond = document.getElementById("plants-beyond");

// HTML elements when there are no plants in the schedule group
const noPlantsToday = document.getElementById("no-plants-today");
const noPlantsNextSevenDays = document.getElementById("no-plants-next-seven-days");
const noPlantsBeyond = document.getElementById("no-plants-beyond");

// HTML loading elements
const plantsTodayLoading = document.getElementById("plants-today-loading");
const plantsNextSevenDaysLoading = document.getElementById("plants-next-seven-days-loading");
const plantsBeyondLoading = document.getElementById("plants-beyond-loading");

// Arrays to store plants by watering shcedule group
const todayPlants = Array();
const nextSevenDayPlants = Array();
const beyondPlants = Array();

// Get users plants and sort them by watering schedule group
getUserPlants({
  action: "get-all-user-plants",
  userId: userData.id,
})
.then((plants) => {
  if(plants.length === 0) {
    const noPlantsMessage = document.getElementById('no-plants');
    noPlantsMessage.style.display = 'flex';

    const reminderContainer = document.getElementById('reminder-container');
    reminderContainer.style.display = 'none';
    return;
  }

  // Sort plants by next watering time
  for(const plant of plants) {
    const nextWateringTime = getNextWateringTime(plant);

    // Add the nextWateringTime value to the plant
    Object.assign(plant, {
      nextWateringTime: nextWateringTime
    })
  }
  
  // Sort plants by nextWateringTime value
  plants.sort(function(a, b) {
    return a.nextWateringTime - b.nextWateringTime
  });

  // Sort plants by schedule group
  for(const plant of plants) {
    if(plant.nextWateringTime < aDay){
      todayPlants.push(plant)
    } else if(plant.nextWateringTime < aWeek) {
      nextSevenDayPlants.push(plant)
    } else {
      beyondPlants.push(plant);
    }
  }

  for(const plant of todayPlants) {
    const plantElement = generatePlantReminder(plant);
    plantsToday.appendChild(plantElement);
  }
  if(todayPlants.length === 0) {
    noPlantsToday.style.display = 'flex';
    plantsToday.style.display = 'none';
  };
  plantsTodayLoading.style.display = 'none';

  for(const plant of nextSevenDayPlants) {
    const plantElement = generatePlantReminder(plant);
    plantsNextSevenDays.appendChild(plantElement);
  }
  if(nextSevenDayPlants.length === 0) {
    noPlantsNextSevenDays.style.display = 'flex';
    plantsNextSevenDays.style.display = 'none';
  }
  plantsNextSevenDaysLoading.style.display = 'none';

  for(const plant of beyondPlants) {
    const plantElement = generatePlantReminder(plant);
    plantsBeyond.appendChild(plantElement);
  }
  if(beyondPlants.length === 0) {
    noPlantsBeyond.style.display = 'flex';
    plantsBeyond.style.display = 'none';
  }
  plantsBeyondLoading.style.display = 'none';
});

// Generate the plant reminder HTML elemt
function generatePlantReminder(plant) {
  // Plant data to display
  const plantImageUrl = plant.image_url;
  const plantName = plant.name;
  const scheduledWateringTime = getFormattedTime(plant.datetime_added.split(' ')[1]);

  // Clone the HTML template
  const plantReminderTemplate = document.getElementById("plant-reminder-template");
  const plantReminder = plantReminderTemplate.content.cloneNode(true);

  // Insert plant data to the HTML element
  const plantImageElement = plantReminder.querySelector('#plant-image');
  plantImageElement.src = plantImageUrl;

  const plantNameElement = plantReminder.querySelector('.plant-name');
  plantNameElement.textContent = plantName;

  const waterReminderText = plantReminder.querySelector('.water-reminder-text');
  waterReminderText.textContent = getWaterReminder(getNextWateringTime(plant));

  const waterScheduleData = plantReminder.querySelector('.water-schedule-data');
  waterScheduleData.textContent = scheduledWateringTime;

  // Handle links
  const linkToUserPlantPage = plantReminder.querySelector('#plant-link');
  linkToUserPlantPage.addEventListener("click", () => {
    window.location.href = `own-plant.html?plant_id=${plant.plant_id}`
  })

  const linkToExplorePlantPage = plantReminder.querySelector('#plant-info');
  linkToExplorePlantPage.addEventListener("click", () => {
    window.location.href = `explore-plant.html?plant_id=${plant.plant_id}`
  })

  return plantReminder;
}

// The plant's data