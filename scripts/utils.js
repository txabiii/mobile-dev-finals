import { getPlant } from '../scripts/api/plantApi.js';

export const notifyElements = {
  notifyMessageElement: document.getElementById("notify-message"),
  labelNotifyMessageElement: document.getElementById("label-notify-message"),
  notifyIconElement: document.getElementById("notify-icon"),
};

export function resetFormInputValues(formFields) {
  Object.values(formFields).forEach((field) => {
    if (field instanceof HTMLElement) {
      field.value = "";
    }
  });
}

export function showErrorBorderColor(formFields) {
  Object.values(formFields).forEach((field) => {
    field.classList.add("error");
  });
}

export function hideErrorBorderColor(formFields) {
  notifyElements.notifyMessageElement.style.display = "none";

  Object.values(formFields).forEach((field) => {
    field.classList.remove("error");
  });
}

export function displayErrorMessage(message) {
  notifyElements.labelNotifyMessageElement.textContent = message;
  notifyElements.notifyIconElement.src = "./assets/error-icon.svg";
  notifyElements.notifyMessageElement.style.display = "block";
  notifyElements.notifyMessageElement.style.backgroundColor =
    "rgba(235, 204, 207, 255)";
  notifyElements.labelNotifyMessageElement.style.color =
    "rgba(173, 52, 62, 255)";
}

export function displaySuccessMessage(message) {
  notifyElements.labelNotifyMessageElement.textContent = message;
  notifyElements.notifyIconElement.src = "./assets/check-icon.svg";
  notifyElements.notifyMessageElement.style.display = "block";
  notifyElements.notifyMessageElement.style.backgroundColor =
    "rgba(121, 158, 41, 1)";
  notifyElements.labelNotifyMessageElement.style.color = "white";
}

export function displayWarningMessage(message) {
  notifyElements.labelNotifyMessageElement.textContent = message;
  notifyElements.notifyIconElement.src = "./assets/exclamation-point-icon.png";
  notifyElements.notifyMessageElement.style.display = "block";
  notifyElements.notifyMessageElement.style.backgroundColor =
    "rgba(0, 71, 171, 255)";
  notifyElements.labelNotifyMessageElement.style.color = "white";
}

export function addFocusEventListenerToFields(fields) {
  Object.values(fields).forEach((field) => {
    field.addEventListener("focus", () => {
      hideErrorBorderColor(fields);
    });
  });
}

export function redirectWithTimeout(formFields, destination) {
  setTimeout(() => {
    resetFormInputValues(formFields);
    window.location.href = destination;
  }, 2000);
}

/**
 * Computes the amount of time between now and the next water scheduling
 * @param {object} plant - The object the data of the plant
 * @returns {Number} A number in milliseconds of the remaining time before the next water schedule
 */
export function getNextWateringTime(plant) {
  const dateAdded = new Date(plant.datetime_added);

  const wateringFrequency = plant.watering_frequency;

  const currentDate = new Date();

  let nextWateringDate = new Date(
    dateAdded.getTime() + wateringFrequency * 24 * 60 * 60 * 1000
  );

  while (nextWateringDate < currentDate) {
    nextWateringDate = new Date(
      nextWateringDate.getTime() + wateringFrequency * 24 * 60 * 60 * 1000
    );
  }

  const timeDifference = nextWateringDate.getTime() - currentDate.getTime();
  return timeDifference;
}

/**
 * Turns Date format variable into human readable string for watering reminder
 * @param {Date} timeDifference 
 * @returns 
 */
export function getWaterReminder(timeDifference) {
  const daysLeft = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
  const hoursLeft = Math.floor(
    (timeDifference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
  );
  const minutesLeft = Math.floor(
    (timeDifference % (60 * 60 * 1000)) / (60 * 1000)
  );

  let waterReminderText;

  if (daysLeft === 0) {
    if (hoursLeft === 0) {
      waterReminderText = minutesLeft + (minutesLeft === 1 ? " minute" : " minutes");
    } else {
      const hoursText = hoursLeft + (hoursLeft === 1 ? " hour" : " hours");
      const minutesText = minutesLeft + (minutesLeft === 1 ? " minute" : " minutes");
      waterReminderText = `${hoursText} and ${minutesText}`;
    }
  } else {
    const daysText = daysLeft + (daysLeft === 1 ? " day" : " days");
    const hoursText = hoursLeft + (hoursLeft === 1 ? " hour" : " hours");
    waterReminderText = `${daysText} and ${hoursText}`;
  }

  return waterReminderText;
}

/**
 * Checks whether the time between two dates is under one hour
 * @param {Date} dateNumberOne 
 * @param {Date} dateNumberTwo 
 * @returns 
 */
export function isTimeDifferenceUnderHour(dateNumberOne, dateNumberTwo) {
  const oneHourInMilliseconds = 60 * 60 * 1000; // 1 hour in milliseconds

  const timeDifference = dateNumberTwo.getTime() - new Date(dateNumberOne).getTime();

  return timeDifference < oneHourInMilliseconds;
}

/**
 * Creates a date time format that will not be messed up when passed to PHP
 * @returns {string}
 */
export function generateDateTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Displays plants' data. Important: requires plant-item-template on the HTML page
 * @param {object} plants 
 * @returns 
 */
export function displayUserPlants(plants) {
  const container = document.getElementById("my-plants");
  const noPlantsContainer = document.getElementById("no-plants");

  if (plants.length === 0) {
    container.style.display = "none";
    noPlantsContainer.style.display = "flex";
    return;
  } else {
    container.style.display = "block";
    noPlantsContainer.style.display = "none";
  }

  for (const plant of plants) {
    const plantItem = createUserPlantItem(plant);
    container.appendChild(plantItem);
  }
}

/**
 * Creates a user plant item HTML element. Important: you need plant-item-template in your HTML
 * @param {Object} plant 
 * @returns {HTML} 
 */
function createUserPlantItem(userPlant) {
  const template = document.getElementById("plant-item-template");
  const userPlantItem = template.content.cloneNode(true);

  const nameElement = userPlantItem.querySelector(".name");
  nameElement.textContent = userPlant.name;

  const waterScheduleElement = userPlantItem.querySelector(".water-schedule");
  const nextWateringTime = getNextWateringTime(userPlant)
  waterScheduleElement.textContent = getWaterReminder(nextWateringTime);

  const oneDay = 60 * 60 * 1000 * 24;
  if(nextWateringTime < oneDay) {
    const smallWaterReminder = userPlantItem.querySelector('.small-water-reminder');
    smallWaterReminder.style.display = 'block'
  }

  const imageElement = userPlantItem.querySelector("#plant-image");
  console.log(imageElement);
  imageElement.src = userPlant.image_url;

  nameElement.addEventListener("click", function () {
    window.location.href = "own-plant.html?plant_id=" + userPlant.plant_id;
  });

  return userPlantItem;
}

/**
 * Displays the plant's data into their respective HTML elements. Important: requires plant-item-template on the HTML page
 * @param {object} plants 
 */
export function displayAllPlants(plants) {
  const container = document.getElementById("explore-plants");

  for (const plant of plants) { 
    const userPlantItem = createPlantItem(plant);
    container.appendChild(userPlantItem);
  }
}

/**
 * Creates a plant item HTML element. Important: you need plant-item-template in your HTML
 * @param {Object} plant 
 * @returns {HTML} 
 */
function createPlantItem(plant) {
  const template = document.getElementById("plant-item-template");
  const plantItem = template.content.cloneNode(true);

  // Plant name
  const nameElement = plantItem.querySelector(".name");
  nameElement.textContent = plant.name;

  // Plant water schedule
  const waterScheduleElement = plantItem.querySelector(".water-schedule");
  if (plant.watering_frequency === 1) waterScheduleElement.textContent = "Water everyday";
  else waterScheduleElement.textContent = `Water every ${plant.watering_frequency} days`;

  // Plant image
  const imageElement = plantItem.querySelector("#plant-image");
  imageElement.src = plant.image_url;

  nameElement.addEventListener("click", function () {
    window.location.href = "explore-plant.html?plant_id=" + plant.plant_id;
  });

  return plantItem;
}

/**
 * Displays in a popup the result from the backend server
 * You can also insert a 'result' object manually, as defined below: 
 * @param {Object = { 'success': Boolean, 'message': String }} result 
 */
export function displayResultPopup(result) {
  const template = document.getElementById("pop-up-template");
  const popupElement = template.content.cloneNode(true);

  if(popupElement && template) {
    const headerElement = popupElement.querySelector('h2');
    headerElement.textContent = result.success ? 'Success' : 'Error';

    const textElement = popupElement.querySelector('.main-text');
    textElement.textContent = result.message;

    const buttonElement = popupElement.querySelector('.standard-button');
    buttonElement.style.backgroundColor = result.success ? 'rgb(var(--green-1-rgb))' : 'rgb(var(--red-rgb))';

    const closeButtonElement = popupElement.querySelector('.close-button');
    buttonElement.addEventListener("click", () => removeDisplayResultPopup());
    closeButtonElement.addEventListener("click", () => removeDisplayResultPopup());

    const body = document.getElementsByTagName("body")[0];
    const firstChild = body.firstChild;
    body.insertBefore(popupElement, firstChild);
  } else {
    console.log("Make sure popup template is in the HTML where the script calling this function exists.")
  }
}

/**
 * Helper function to remove pop-up
 */
function removeDisplayResultPopup() {
  const popupElement = document.querySelector('.pop-up-wrapper');
  popupElement.remove();
}

/**
 * @type {Boolean}
 */
var addPlantButtonToggled = false;
/**
 * Toggles the add plants display.
 */
export function toggleAddPlants () {
  addPlantButtonToggled = !addPlantButtonToggled;

  const addPlantWrapper = document.querySelector('.add-plant-wrapper');
  const plantsContainer = document.querySelector('#add-plants-list');
  const addPlantButton = document.querySelector('#add-plant-circle-button');
  const closeButton = addPlantWrapper.querySelector('.close-button');

  if(addPlantButtonToggled) {
    addPlantWrapper.style.display = 'block'; 
    if(plantsContainer) {
      if(plantsContainer.innerHTML !== '') return;
      getPlant({
        action: 'get-all-plants'
      })
      .then((plants) => {
        plantsContainer.innerHTML = '';
        for(const plant of plants) {
          const plantItem = createPlantItem(plant);
          plantsContainer.appendChild(plantItem);
        }
  
        const loading = document.querySelector('#add-plants-loading-group');
        loading.style.display = 'none';
      })
    }

    closeButton.addEventListener("click", () => {
      addPlantWrapper.style.display = 'none';
      addPlantButton.style.transform = 'rotateZ(0deg)';
    })
    addPlantButton.style.transform = 'rotateZ(45deg)';
  } else {
    addPlantWrapper.style.display = 'none';
    addPlantButton.style.transform = 'rotateZ(0deg)';
  }
}

/**
 * Returns a time in AM or PM format
 * @param {Numbee} time in milliseconds 
 * @returns 
 */
export function getFormattedTime(time) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(new Date(`2000-01-01T${time}`));
}