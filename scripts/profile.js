import { toggleAddPlants } from "./utils.js";

/**
 * Select add plant buttons and add the `toggleAddPlants` event
 */
<<<<<<< HEAD
Array.from(document.getElementsByClassName("add-plant-button")).forEach(
  (button) => button.addEventListener("click", toggleAddPlants)
);

=======
Array.from(document.getElementsByClassName("add-plant-button"))
  .forEach(button => button.addEventListener("click", toggleAddPlants));
  
>>>>>>> b62add6d72efe0364c856f40b10f8a48ff217649
const editProfile = document.getElementById("label-edit-button");

editProfile.addEventListener("click", function () {
  window.location.href = "edit-profile.html";
});

window.addEventListener("load", function () {
  const userData = JSON.parse(this.localStorage.getItem("user_data"));
  const userCredentials = {
    username: document.getElementById("actual-username"),
    email: document.getElementById("actual-email-address"),
  };
  userCredentials.username.textContent = userData.username;
  userCredentials.email.textContent = userData.email;
});
