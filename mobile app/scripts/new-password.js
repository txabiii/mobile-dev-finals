import { updateUserAccount } from "./api/userAccountAPI.js";
import {
  showErrorBorderColor,
  displayErrorMessage,
  displaySuccessMessage,
  addFocusEventListenerToFields,
  redirectWithTimeout,
} from "./utils.js";

const sendButton = document.getElementById("send-button");
const formFields = {
  newPassword: document.getElementById("new-password-input"),
  confirmPassword: document.getElementById("confirm-password-input"),
};
const userData = JSON.parse(localStorage.getItem("user_data"));

addFocusEventListenerToFields(formFields);

function getFormInputValues() {
  return {
    action: "new_password",
    user_id: userData.user_id,
    newPassword: formFields.newPassword.value.trim(),
    confirmPassword: formFields.confirmPassword.value.trim(),
  };
}

function validateForm() {
  const form = getFormInputValues();

  if (!form.newPassword && !form.confirmPassword) {
    showErrorBorderColor(formFields);
    displayErrorMessage("Please fill out the fields.");
    return false;
  } else if (!form.newPassword) {
    formFields.newPassword.classList.add("error");
    displayErrorMessage("Please enter a new password.");
    return false;
  } else if (form.newPassword.length < 8) {
    formFields.newPassword.classList.add("error");
    displayErrorMessage("Password must be at least 8 characters long.");
    return false;
  } else if (!form.confirmPassword) {
    formFields.confirmPassword.classList.add("error");
    displayErrorMessage("Please confirm your password.");
    return false;
  } else if (form.newPassword !== form.confirmPassword) {
    formFields.newPassword.classList.add("error");
    formFields.confirmPassword.classList.add("error");
    displayErrorMessage("Passwords do not match.");
    return false;
  } else {
    return true;
  }
}

sendButton.addEventListener("click", function () {
  const form = getFormInputValues();

  if (validateForm()) {
    updateUserAccount(form).then((data) => {
      if (data.status === "success") {
        displaySuccessMessage(data.message);
        redirectWithTimeout(formFields, "login.html");
      } else {
        showErrorBorderColor(formFields);
        displayErrorMessage(data.message);
      }
    });
  }
});
