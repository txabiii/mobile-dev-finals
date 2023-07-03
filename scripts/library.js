import { displayAllPlants, toggleAddPlants } from "./utils.js";
import { getPlant } from "./api/plantApi.js";

/**
 * Select add plant buttons and add the `toggleAddPlants` event
 */
Array.from(document.getElementsByClassName('add-plant-button'))
  .forEach(button => button.addEventListener('click', toggleAddPlants));

getPlant({
  action: 'get-all-plants',
  plantId: null
}).then((plants) => {
  const loading = document.querySelector("#library-plants-loading-group");
  loading.style.display = "none";

  displayAllPlants(plants);
});