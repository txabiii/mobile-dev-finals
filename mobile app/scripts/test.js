import { uploadFileToServer } from "./api/userAccountAPI.js";

const tryButton = document.getElementById("try-button");
tryButton.addEventListener("click", () => {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0]; // Get the selected file from the input field

  if (!file) {
    // No file selected, handle the error
    console.error("No file selected.");
    return;
  }

  const payload = new FormData();
  payload.append('image', file);

  uploadFileToServer(payload)
    .then((response) => {
      console.log(response);
      // Handle the response here
    })
    .catch((error) => {
      console.error(error);
      // Handle the error here
    });
});