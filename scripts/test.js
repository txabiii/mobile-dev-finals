import { uploadFileToServer } from "./api/userAccountAPI.js";

const tryButton = document.getElementById("try-button");
tryButton.addEventListener("click", () => {
  console.log("hello")
  //try to upload a file
  const fileContent = 'This is the content of the file.';
  const fileName = 'dummy.txt';
  const fileType = 'text/plain';

  const file = new File([fileContent], fileName, { type: fileType });

  // Use the file in your upload function
  const dummyPayload = new FormData();
  dummyPayload.append('file', file);

  uploadFileToServer(dummyPayload)
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });
})