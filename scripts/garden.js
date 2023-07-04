import { userData } from "./data.js";
import { getUserPlants } from "./api/userPlantsApi.js";
import { displayUserPlants, toggleAddPlants } from "./utils.js";

/**
 * Select add plant buttons and add the `toggleAddPlants` event
 */
Array.from(document.getElementsByClassName('add-plant-button'))
  .forEach(button => button.addEventListener('click', toggleAddPlants));

/**
 * Get data of user's plants
 * Displays the plants of the user
 */
getUserPlants({
  action: "get-all-user-plants",
  userId: userData.id,
})
.then((userPlants) => {
  const loading = document.querySelector("#garden-plants-loading-group");
  loading.style.display = "none";

  displayUserPlants(userPlants);
});
