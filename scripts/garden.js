import { userData } from "./data.js";
import { getUserPlants } from "./api/userPlantsApi.js";
import { displayMyPlants } from "./utils.js";

/**
 * Get data of user's plants
 * Displays the plants of the user
 */
getUserPlants({
  action: 'get-all-user-plants',
  userId: userData.id
}).then((userPlants) => {
  const loading = document.querySelector('#garden-plants-loading-group');
  loading.style.display = "none";

  displayMyPlants(userPlants);
})