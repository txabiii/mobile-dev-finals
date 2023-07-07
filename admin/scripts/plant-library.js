import { logoutAccount } from "../../scripts/api/userAccountAPI.js";
import { generateDateTimeGreeting } from "./utils.js"
import { getPlant } from './api/plantApi.js'

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

getPlant({
  action: 'get-all-plants'
})
.then((data) => {
  for(const plant of data) {
    // Clone the template
    const clone = document.importNode(template.content, true);

    // Get relevant HTML elements from the cloned template
    const plantImage = clone.querySelector('.plant-image');
    const plantName = clone.querySelector('.plant-name');
    const scientificName = clone.querySelector('.barlow-medium-italic-apple-16px');
    const editButton = clone.querySelector('#edit-plant');
    const tipsButton = clone.querySelector('#edit-plant');
    const deleteButton = clone.querySelector('#edit-plant');

    plantImage.src = plant.image_url;
    plantName.textContent = plant.name;
    scientificName.textContent = plant.scientific_name;

    resultContainer.appendChild(clone)
  }
})