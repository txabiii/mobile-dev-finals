import { logoutAccount } from "./api/userAccountAPI.js";
import {
  toggleAddPlants,
  displayErrorMessage,
  displaySuccessMessage,
} from "./utils.js";

const logoutButton = document.getElementById("logout_button");

logoutButton.addEventListener("click", function () {
    window.alert("test click.")
});

window.addEventListener("load", function () {
    const userData = JSON.parse(this.localStorage.getItem("user_data"));
    const userCredentials = {
      username: document.getElementById("actual-username"),
      email: document.getElementById("actual-email-address"),
      profileImgElement: document.getElementById("profile-image"),
    };
    userCredentials.username.textContent = userData.username;
    userCredentials.email.textContent = userData.email;
  
    if (userData.profile_image_url) {
      userCredentials.profileImgElement.src = userData.profile_image_url;
    }
});