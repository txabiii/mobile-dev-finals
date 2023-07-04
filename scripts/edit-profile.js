import { updateUserAccount } from "./api/userAccountAPI.js";
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
  const payload = {
    action: "update_user_credentials",
    user_id: userData.user_id,
  };

  const newUsername = formFields.username.value.trim();
  const newEmail = formFields.email.value.trim();
  const newPassword = formFields.password.value.trim();
  const newProfilePictureFile = formFields.profilePictureFile.files[0];

  if (newUsername !== userData.username) {
    payload.username = newUsername;
  }

  if (newEmail !== userData.email) {
    payload.email = newEmail;
  }

  if (newPassword !== "") {
    payload.password = newPassword;
  }

  if (newProfilePictureFile) {
    payload.profilePictureFile = newProfilePictureFile.name;
  }

  return payload;
}

function validateEditForm() {
  const form = getFormInputValues();
  const keys = Object.keys(form);
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (keys.length === 2 && keys[0] === "action" && keys[1] === "user_id") {
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
});

cancelButton.addEventListener("click", function () {
  window.location.href = "profile.html";
});

saveButton.addEventListener("click", function () {
  const form = getFormInputValues();
  if (validateEditForm()) {
    updateUserAccount(form).then((data) => {
      if (data.status === "success") {
        localStorage.setItem("user_data", JSON.stringify(data.data));
        displaySuccessMessage(data.message);
        redirectWithTimeout(formFields, "profile.html");
      } else {
        if (data.error === "username") {
          formFields.username.classList.add("error");
        } else {
          formFields.email.classList.add("error");
        }
        displayErrorMessage(data.message);
      }
    });
  }
});
