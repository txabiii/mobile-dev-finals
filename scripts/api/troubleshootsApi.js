import { SERVER_URL } from "../config.js";
import { displayResultPopup } from "../utils.js";

export function getTroubleshoots(plantId) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/api/troubleshoots_controller.php?plantId=${plantId}`)
    .then(response => response.json())
    .then(result => {
      if(!result.success) displayResultPopup(result);
      const data = result.data;
      resolve(data)
    })
    .catch(error => reject(error));
  }) 
}