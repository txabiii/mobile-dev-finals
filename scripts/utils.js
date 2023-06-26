import { myPlantsData, allPlantsData } from "./data.js";

/**
 * Computes the amount of time between now and the next water scheduling
 * @param {string} plantId - The string id of the plant 
 * @returns {string} A string containing the remaining time before the next water schedule
 */
export function getWaterReminder(plantId) {
  const parsedPlantId = parseInt(plantId)

  const plant = myPlantsData.find((plant) => plant.id === parsedPlantId);

  const dateAdded = new Date(plant.date_added);
  const wateringFrequency = allPlantsData[plant.id].watering_frequency;

  const currentDate = new Date();

  let nextWateringDate = new Date(dateAdded.getTime() + (wateringFrequency * 24 * 60 * 60 * 1000));

  while (nextWateringDate < currentDate) {
    nextWateringDate = new Date(nextWateringDate.getTime() + (wateringFrequency * 24 * 60 * 60 * 1000));
  }

  const timeDifference = nextWateringDate.getTime() - currentDate.getTime();
  
  const daysLeft = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
  const hoursLeft = Math.floor((timeDifference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

  let waterReminderText = ''

  if(daysLeft === 0) waterReminderText = hoursLeft + ' hours';
    else waterReminderText = daysLeft + ' days' + ' & ' + hoursLeft + ' hours';

  return waterReminderText
}