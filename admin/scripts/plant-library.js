import { logoutAccount } from "../../scripts/api/userAccountAPI.js";
import { generateDateTimeGreeting, debounce, displayResultPopup } from "./utils.js"
import { getPlant, deletePlant } from './api/plantApi.js'

const logoutButton = document.getElementById("logout-button");
logoutButton.addEventListener("click", function () {
    const payload = { action: "logout" };
  
    logoutAccount(payload).then((data) => {
      if (data.status === "success") {
        window.alert("You have logged out.")
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      } else {
        window.alert("There has been an error while logging out.")
      }
    });
  });


  window.addEventListener("load", function () {
    const userData = JSON.parse(this.localStorage.getItem("user_data"));
    const userCredentials = {
      username: document.getElementById("actual-username"),
      email: document.getElementById("actual-email-address"),
      profileImgElement: document.getElementById("profile-image"),
    };
    userCredentials.username.innerHTML = userData.username;
    userCredentials.email.innerHTML = userData.email;
  
    if (userData.profile_image_url) {
      userCredentials.profileImgElement.src = userData.profile_image_url;
    }

    const headerElement = this.document.querySelector('.header-text');
    headerElement.innerHTML = `Hello, ${userData.username}`

    const datetimeElement = this.document.querySelector('.header-subtext');
    datetimeElement.textContent = generateDateTimeGreeting();
});

// Get the template element
const template = document.querySelector('.plant-container-template');
const resultContainer = document.querySelector('.result-position');

function displayPlants() {
  getPlant({
    action: 'get-all-plants'
  })
  .then((data) => {
    resultContainer.innerHTML = '';

    for(const plant of data) {
      const clone = createPlantItem(plant)  
      resultContainer.appendChild(clone)
    }
  })
}

displayPlants();

function createPlantItem(plant) {
  // Clone the template
  const clone = document.importNode(template.content, true);

  // Get relevant HTML elements from the cloned template
  const plantImage = clone.querySelector('.plant-image');
  const plantName = clone.querySelector('.plant-name');
  const scientificName = clone.querySelector('#Scientific-name');
  const editButton = clone.querySelector('#edit-plant');
  const tipsButton = clone.querySelector('#tip-link');
  const deleteButton = clone.querySelector('#delete-plant');

  plantImage.src = plant.image_url;
  plantName.textContent = plant.name;
  scientificName.textContent = plant.scientific_name;

  tipsButton.addEventListener("click", () => {
    window.location.href = `tips.html?plant_id=${plant.plant_id}&plant_name=${plant.name}`;
  })

  deleteButton.addEventListener("click", () => {
    deletePlant(plant.plant_id).then(() => {
      displayResultPopup({success: true, message: 'Plant deleted. (This page will refresh)'});
      setTimeout(() => {
        location.reload();
      }, 5000);
    })
  })

  return clone;
}

const plantSearchInput = document.querySelector('#plant-search');
plantSearchInput.addEventListener('input', () => {
  if(plantSearchInput.value < 4) return;
  debounce(handlePlantSearch(plantSearchInput.value), 300)
})

function handlePlantSearch(search) {
  getPlant({
    action: 'search-plants',
    search: search
  })
  .then((data) => {
    resultContainer.innerHTML = '';

    for(const plant of data) {
      const clone = createPlantItem(plant)  
      resultContainer.appendChild(clone)
    }
  })
}