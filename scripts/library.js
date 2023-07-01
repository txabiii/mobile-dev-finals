import { displayAllPlants } from "./utils.js";
import { getPlant } from "./api/plantApi.js";

getPlant({
  action: 'get-all-plants',
  plantId: null
}).then((plants) => {
  const loading = document.querySelector("#library-plants-loading-group");
  loading.style.display = "none";

  displayAllPlants(plants);
});