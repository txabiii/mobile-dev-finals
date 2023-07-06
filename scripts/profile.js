import { logoutAccount } from "./api/userAccountAPI.js";
import {
  toggleAddPlants,
  displayErrorMessage,
  displaySuccessMessage,
} from "./utils.js";

/**
 * Select add plant buttons and add the `toggleAddPlants` event
 */
Array.from(document.getElementsByClassName("add-plant-button")).forEach(
  (button) => button.addEventListener("click", toggleAddPlants)
);

const editProfile = document.getElementById("label-edit-button");
const logoutButton = document.getElementById("logout-button");

editProfile.addEventListener("click", function () {
  window.location.href = "edit-profile.html";
});

logoutButton.addEventListener("click", function () {
  const payload = { action: "logout" };

  logoutAccount(payload).then((data) => {
    if (data.status === "success") {
      displaySuccessMessage(data.message);
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    } else {
      displayErrorMessage(data.message);
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
  userCredentials.username.textContent = userData.username;
  userCredentials.email.textContent = userData.email;

  if (userData.profile_image_url) {
    userCredentials.profileImgElement.src = userData.profile_image_url;
  }
});
