import { updateUserCredentials } from "./api/userAccountAPI.js";
import {
  displayErrorMessage,
  displaySuccessMessage,
  displayWarningMessage,
  addFocusEventListenerToFields,
  redirectWithTimeout,
} from "./utils.js";

const saveButton = document.getElementById("save-button");
const cancelButton = document.getElementById("cancel-button");
const userData = JSON.parse(localStorage.getItem("user_data"));

const formFields = {
  username: document.getElementById("actual-username-input"),
  email: document.getElementById("actual-email-address-input"),
  password: document.getElementById("actual-password-input"),
  profilePictureFile: document.getElementById("change-photo-file"),
};

addFocusEventListenerToFields(formFields);

function getFormInputValues() {
  const payload = new FormData();

  payload.append("user_id", userData.user_id);

  const newUsername = formFields.username.value.trim();
  const newEmail = formFields.email.value.trim();
  const newPassword = formFields.password.value.trim();
  const newProfilePictureFile = formFields.profilePictureFile.files[0];

  if (newUsername !== userData.username) {
    payload.append("username", newUsername);
  }

  if (newEmail !== userData.email) {
    payload.append("email", newEmail);
  }

  if (newPassword !== "") {
    payload.append("password", newPassword);
  }

  if (newProfilePictureFile) {
    payload.append("profilePictureFile", newProfilePictureFile);
  }

  return payload;
}

function validateEditForm() {
  const form = getFormInputValues();
  const keys = Array.from(form.keys());
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (keys.length === 1 && keys[0] === "user_id") {
    displayWarningMessage("No changes.");
  } else if (!formFields.username.value && !formFields.email.value) {
    formFields.username.classList.add("error");
    formFields.email.classList.add("error");
    displayErrorMessage("Please fill out the fields.");
    return false;
  } else if (!formFields.username.value) {
    formFields.username.classList.add("error");
    displayErrorMessage("Please enter a username.");
    return false;
  } else if (!formFields.email.value) {
    formFields.email.classList.add("error");
    displayErrorMessage("Please enter an email address.");
    return false;
  } else if (!emailRegex.test(formFields.email.value)) {
    formFields.email.classList.add("error");
    displayErrorMessage("Please enter a valid email address.");
    return false;
  } else if (formFields.password.value === "") {
    return true;
  } else if (formFields.password.value.length < 8) {
    formFields.password.classList.add("error");
    displayErrorMessage("Password must be at least 8 characters long.");
    return false;
  } else {
    return true;
  }
}

window.addEventListener("load", function () {
  formFields.username.value = userData.username;
  formFields.email.value = userData.email;

  if (userData.profile_image_url) {
    const profileImgElement = document.getElementById("profile-image");
    profileImgElement.src = userData.profile_image_url;
  }
});

cancelButton.addEventListener("click", function () {
  window.location.href = "profile.html";
});

saveButton.addEventListener("click", function () {
  const form = getFormInputValues();
  if (validateEditForm()) {
    updateUserCredentials(form).then((data) => {
      if (data.status === "success") {
        localStorage.setItem("user_data", JSON.stringify(data.data));
        displaySuccessMessage(data.message);
        redirectWithTimeout(formFields, "profile.html");
      } else {
        if (data.error === "username") {
          formFields.username.classList.add("error");
        } else if (data.error === "email") {
          formFields.email.classList.add("error");
        }
        displayErrorMessage(data.message);
      }
    });
  }
});
