import { myPlantsData } from "./data.js";
import { getWaterReminder } from "./utils.js";

function verifyPlantId() {
  const urlParameters = new URLSearchParams(window.location.search);

  const plantId = urlParameters.get("plant_id");

  if (!isNaN(plantId)) {
    const parsedPlantId = parseInt(plantId);

    const plant = myPlantsData.find((plant) => plant.id === parsedPlantId);

    if(plant) {
      const waterScheduleElement = document.getElementById('water-schedule')
      waterScheduleElement.innerText = getWaterReminder(plantId)
    } else {
      window.location.href = baseUrl + "/index.html";
    }
  } else {
    window.location.href = baseUrl + "/index.html";
  }
}

verifyPlantId()