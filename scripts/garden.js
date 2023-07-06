import { userData } from "./data.js";
import { getUserPlants } from "./api/userPlantsApi.js";
import { displayUserPlants, toggleAddPlants } from "./utils.js";

/**
 * Waits for the home page to finish loading, retrieves the profile image from sessionStorage.
 */
window.addEventListener("load", function () {
  const userData = JSON.parse(this.localStorage.getItem("user_data"));

  if (userData.profile_image_url) {
    const profileImgElement = document.getElementById("profile-img");
    profileImgElement.src = userData.profile_image_url;
  }
});

/**
 * Select add plant buttons and add the `toggleAddPlants` event
 */
Array.from(document.getElementsByClassName("add-plant-button")).forEach(
  (button) => button.addEventListener("click", toggleAddPlants)
);

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

  if (userPlants.length === 0) {
    const searchPlant = document.getElementById("search-plant");
    searchPlant.style.display = "none";

    const noPlantsMessage = document.getElementById("no-plants");
    noPlantsMessage.style.display = "flex";

    const exploreNewPlantsButton =
      document.getElementById("explore-new-plants");
    exploreNewPlantsButton.style.display = "none";
    return;
  }

  displayUserPlants(userPlants);
});
