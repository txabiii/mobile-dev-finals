import { userData } from "./data.js";
import { getUserPlants } from "./api/userPlantsApi.js";
import { displayMyPlants } from "./utils.js";

/**
 * Waits for the home page to finish loading, retrieves a username from sessionStorage.
 * Display the username followed by an exclamation mark in an HTML element with the ID "name".
 */
window.addEventListener("load", function () {
  const userData = JSON.parse(this.localStorage.getItem("user_data"));
  const usernameElement = document.getElementById("name");
  usernameElement.textContent = userData.username + `!`;
});

/**
 * Get data of user's plants
 * Displays the plants of the user
 */
getUserPlants({
  action: "get-all-user-plants",
  userId: userData.id,
}).then((userPlants) => {
  const loading = document.querySelector("#garden-plants-loading-group");
  loading.style.display = "none";

  displayMyPlants(userPlants);
});
