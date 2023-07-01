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
 * @returns {string} A string of the remaining time before the next water schedule
 */
export function getWaterReminder(plant) {
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

  const daysLeft = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
  const hoursLeft = Math.floor(
    (timeDifference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
  );

  let waterReminderText = "";

  if (daysLeft === 0) waterReminderText = hoursLeft + " hours";
  else waterReminderText = daysLeft + " days" + " & " + hoursLeft + " hours";

  return waterReminderText;
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
export function displayMyPlants(plants) {
  const template = document.getElementById("plant-item-template");
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
    const plantItem = template.content.cloneNode(true);

    // Plant name
    const nameElement = plantItem.querySelector(".name");
    nameElement.textContent = plant.name;

    // Plant water schedule
    const waterScheduleElement = plantItem.querySelector(".water-schedule");
    waterScheduleElement.textContent = getWaterReminder(plant);

    // Plant image
    const imageElement = plantItem.querySelector("img");
    imageElement.src = plant.image_url;

    nameElement.addEventListener("click", function () {
      window.location.href = "own-plant.html?plant_id=" + plant.plant_id;
    });

    container.appendChild(plantItem);
  }
}

/**
 * Displays the plant's data into their respective HTML elements. Important: requires plant-item-template on the HTML page
 * @param {object} plants 
 */
export function displayAllPlants(plants) {
  const template = document.getElementById("plant-item-template");
  const container = document.getElementById("explore-plants");

  for (const plant of plants) {
    const plantItem = template.content.cloneNode(true);

    const nameElement = plantItem.querySelector(".name");
    nameElement.textContent = plant.name;

    const waterScheduleElement = plantItem.querySelector(".water-schedule");
    if (plant.watering_frequency === 1) waterScheduleElement.textContent = "Water everyday";
    else waterScheduleElement.textContent = `Water every ${plant.watering_frequency} days`;

    const imageElement = plantItem.querySelector("img");
    imageElement.src = plant.image_url;

    nameElement.addEventListener("click", function () {
      window.location.href = "explore-plant.html?plant_id=" + plant.plant_id;
    });

    container.appendChild(plantItem);
  }
}