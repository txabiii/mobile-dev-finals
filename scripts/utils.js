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
