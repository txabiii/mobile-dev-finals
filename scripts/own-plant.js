import { getNextWateringTime, getWaterReminder, generateDateTime, displayResultPopup, toggleAddPlants } from "./utils.js";
import { getUserPlants, deleteUserPlant } from './api/userPlantsApi.js';
import { userData } from './data.js';
import { getTips } from "./api/tipsApi.js";
import { createWateringHistory, getWateringHistory } from './api/wateringHistoryApi.js'

/**
 * Select add plant buttons and add the `toggleAddPlants` event
 */
Array.from(document.getElementsByClassName("add-plant-button"))
  .forEach(button => button.addEventListener("click", toggleAddPlants));

/**
 * Adds an event listener to the goBackImage element, which navigates to the home page when clicked.
 * @type {HTMLElement}
 */
const goBackImage = document.getElementById("go-back-image");
goBackImage.addEventListener("click", function() {
  window.location.href = "garden.html";
});

/**
 * Parses the URL search parameters from the current window location.
 * Retrieves the "plant_id" parameter from the URL search parameters.
 * @type {URLSearchParams}
 * @type {string}
 */
const urlParameters = new URLSearchParams(window.location.search);
const plantId = urlParameters.get("plant_id");

/**
 * Get user's specific plant
 * then call 'displayUserPlants' to show the plant's datas
 */
getUserPlants({
  action: 'get-specific-user-plant',
  plantId: plantId,
  userId: userData.id
})
.then((userPlants) => {
  const plantOverviewLoadingPlaceholder = document.querySelector('#plant-overview-loading');
  plantOverviewLoadingPlaceholder.style.display = 'none';
  
  const plantGuideLoadingPlaceholder = document.querySelector('#plant-guide-loading');
  plantGuideLoadingPlaceholder.style.display = 'none';

  const parsedId = parseInt(plantId)
  const plant = userPlants.find(item => item.plant_id === parsedId);
  displayPlantData(plant);
})
.catch(() => {
  window.location.href = 'home.html'
})

/**
 * Displays the plant's data into the HTML
 * @param {Object} plant 
 */
function displayPlantData(plant) {
  //For the water reminder
  handleWaterReminder(plant);

  //For the plant essential info
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
  
  // For the plant extra details
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

  // For the plants stats
  const plantStatsLabel = document.querySelector('#plant-stats-label');
  plantStatsLabel.textContent = `Your ${plant.name} Stats`;

  const dateOnly = plant.datetime_added.split(" ")[0];
  const timeOnly = plant.datetime_added.split(" ")[1];
  const unformattedTime = new Date(`1970-01-01T${timeOnly}`);
  const formattedTime = unformattedTime.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });

  const dateAddedStat = document.querySelector('#date-added-stats');
  dateAddedStat.querySelector('#text').innerHTML = `You added Bougainvillea on <span class="data">${dateOnly}</span>`;

  const daysSpentStat = document.querySelector('#days-spent-stats');
  const daysDifference = getDayDifferenceFromToday(plant.datetime_added);
  daysSpentStat.querySelector('#text').innerHTML = `You've spent <span class="data">${daysDifference}</span> days with your ${plant.name}`

  const waterScheduleStat = document.querySelector('#water-schedule-stats');
  waterScheduleStat.querySelector('#text').innerHTML = `Your watering schedule is <span class="data">${formattedTime + ' every ' + plant.watering_frequency + ' days'}</span>`;

  const waterRecordedStat = document.querySelector('#water-recorded-stats');
  getWateringHistory({
    action: 'get-user-specific-plant-watering-history',
    userId: userData.id,
    plantId: plant.plant_id
  })
  .then((data) => {
    if(data.length === 0) {
      waterRecordedStat.querySelector('#text').innerHTML = `You have <span class="data">no records</span> of watering this plant...yet!`
    } else {
      waterRecordedStat.querySelector('#text').innerHTML = `On our records, you have watered this plant <span class="data">${data.length}</span> times`
    }
  })

  //For deleting the plant
  const deletePlantLabel = document.querySelector('#delete-plant-label');
  deletePlantLabel.textContent = `Remove ${plant.name}`
  deletePlantLabel.addEventListener("click", () => showConfirmDeletePopUp(plant))
}

/**
 * Shows the confirm deletion popup
 * @param {object} plant 
 */
function showConfirmDeletePopUp(plant){
  const confirmDeletePopUpTemplate = document.querySelector('#confirm-delete-popup');

  const confirmPopupElement = confirmDeletePopUpTemplate.content.cloneNode(true);

  const removePlantLabel = confirmPopupElement.querySelector('#remove-plant-label');
  removePlantLabel.textContent = `Remove ${plant.name}`;

  const mainTextElement = confirmPopupElement.querySelector('.main-text');
  mainTextElement.innerHTML = `You are about to remove <b>${plant.name}</b> from your plants`;

  const confirmRemoveButtonElement = confirmPopupElement.querySelector('#confirm-remove-button');
  confirmRemoveButtonElement.addEventListener("click", () => deleteUserPlant({
      action: 'delete-user-plant',
      plantId: plant.plant_id,
      userId: plant.id
    }).then(() => {
      window.location.href = "garden.html"
    })
  )

  const cancelButtonElement = confirmPopupElement.querySelector('#cancel-button');
  cancelButtonElement.addEventListener("click", () => closeRemovePlantPopup());

  const closeButtonElement = confirmPopupElement.querySelector(".close-button");
  closeButtonElement.addEventListener("click", () => closeRemovePlantPopup());

  const body = document.getElementsByTagName("body")[0];
  const firstChild = body.firstChild;
  body.insertBefore(confirmPopupElement, firstChild);
}

/**
 * A helper function for closing the confirm remove plant popup
 */
function closeRemovePlantPopup() {
  const confirmPopupElement = document.querySelector(".pop-up-wrapper");
  confirmPopupElement.remove();
}

/**
 * A helper function that gets the difference between the input date and the date today
 * @param {string} date 
 * @returns 
 */
function getDayDifferenceFromToday(date) {
  const targetDate = new Date(date);
  const today = new Date();
  const timeDifference = targetDate.getTime() - today.getTime();
  const daysDifference = Math.ceil(Math.abs(timeDifference) / (1000 * 60 * 60 * 24));
  return daysDifference;
}

/**
 * Fetch tips and populate the template
 * @param {object} payload contains action and plantId
 */
getTips({
  action: 'get-plant-tips',
  plantId: plantId
})
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
  
  // Add click function to the tips' dots
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

/**
 * A helper function to delay events
 * @param {number} func 
 * @param {number} delay 
 * @returns 
 */
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

/**
 * Handle the water's reminder data in the HTML
 * @param {Object} plant 
 * @returns 
 */
function handleWaterReminder(plant){
  const timeDifference = getNextWateringTime(plant)

  //for the water schedule element in the reminder section
  const waterScheduleElement = document.getElementById('water-schedule')
  waterScheduleElement.innerText = getWaterReminder(timeDifference)
  
  //if today is not the watering day, simply return
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
  const isUnderAday = timeDifference < oneDayInMilliseconds;
  if(!isUnderAday) return;

  //for the floating reminder
  const waterReminderWrapper = document.querySelector('.water-reminder-wrapper'); 
  const WaterReminderTextElement = waterReminderWrapper.querySelector('p');

  // Get the latest watering date, handle different states accordingly
  getWateringHistory({
    action: 'get-user-specific-plant-watering-history',
    userId: userData.id,
    plantId: plant.plant_id
  })
  .then((wateringData) => {
    const aDay = 60 * 60 * 1000 * 24;
    if(timeDifference < aDay) {
      waterReminderWrapper.style.display = 'flex';

      const anHour = 60 * 60 * 1000;
      if(timeDifference < anHour) {        
        WaterReminderTextElement.innerHTML = `It's about time to water your <span>${plant.name}</span>. Click here to record your progress.`

        WaterReminderTextElement.addEventListener("click", () => createWateringHistory({
          userId: userData.id,
          plantId: plant.plant_id,
          datetime: generateDateTime()
        })
        .then(() => {
          displayResultPopup({ success: true, message: `You've just recorded your watering of your ${plant.name}! Keep on it`});
          setTimeout(function() {
            location.reload();
          }, 5000);
        }))
      }

      const scheduledWateringTime = plant.datetime_added.split(' ')[1];
      const formattedScheduledWateringTime = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }).format(new Date(`2000-01-01T${scheduledWateringTime}`));

      const latestWateringDate = new Date(Date.parse(wateringData[0].datetime_watered));
      const dateToday = new Date();

      const latestWateringDay = latestWateringDate.getDay()
      const today = dateToday.getDay();

      if(wateringData.length !== 0) {
        if(latestWateringDay === today) {
          styleFloatingReminderGreen();
          WaterReminderTextElement.innerHTML = `You've watered your <span>${plant.name}</span> today at ${latestWateringDate.toLocaleTimeString()} Give yourself a pat in the back!`;
        } else {
          styleFloatingReminderGreen();
          WaterReminderTextElement.innerHTML = `You're scheduled to water your <span>${plant.name}</span> at <span>${formattedScheduledWateringTime}</span>. Don't forget!`
        }
      } else {
        console.log("here")
        styleFloatingReminderGreen();
        WaterReminderTextElement.innerHTML = `You're scheduled to water your <span>${plant.name}</span> at <span>${formattedScheduledWateringTime}</span>. Don't forget!`
      }
    } else {
      waterReminderWrapper.style.display = 'none'; 
    }
  })
}

/**
 * Style the floating reminder green
 */
function styleFloatingReminderGreen() {
  const waterReminderWrapper = document.querySelector('.water-reminder-wrapper'); 

  waterReminderWrapper.style.backgroundColor = 'rgb(var(--green-2-rgb))';
  waterReminderWrapper.style.border = 'none'
  waterReminderWrapper.querySelector('img').style.filter = 'unset';
  waterReminderWrapper.querySelector('.pulse').style.display = 'none';
  waterReminderWrapper.querySelector('p').style.color = 'white';
}