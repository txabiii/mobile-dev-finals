import { updateUserAccount } from "./api/userAccountAPI.js";

const sendButton = document.getElementById("send-button");
const notifyMessageElement = document.getElementById("notify-message");
const labelNotifyMessageElement = document.getElementById(
  "label-notify-message"
);
const notifyIconElement = document.getElementById("notify-icon");
const formFields = {
  newPassword: document.getElementById("new-password-input"),
  confirmPassword: document.getElementById("confirm-password-input"),
};
const userData = JSON.parse(sessionStorage.getItem("user_data"));

function getFormInputValues() {
  return {
    action: "new_password",
    user_id: userData.user_id,
    newPassword: formFields.newPassword.value.trim(),
    confirmPassword: formFields.confirmPassword.value.trim(),
  };
}

function resetFormInputValues() {
  formFields.newPassword.value = "";
  formFields.confirmPassword.value = "";
}

function showErrorBorderColor() {
  Object.values(formFields).forEach((field) => {
    field.classList.add("error");
  });
}

function hideErrorBorderColor() {
  notifyMessageElement.style.display = "none";

  Object.values(formFields).forEach((field) => {
    field.classList.remove("error");
  });
}

function displayErrorMessage(message) {
  labelNotifyMessageElement.textContent = message;
  notifyIconElement.src = "./assets/error-icon.svg";
  notifyMessageElement.style.display = "block";
  notifyMessageElement.style.backgroundColor = "rgba(235, 204, 207, 255)";
  labelNotifyMessageElement.style.color = "rgba(173, 52, 62, 255)";
}

function displaySuccessMessage(message) {
  labelNotifyMessageElement.textContent = message;
  notifyIconElement.src = "./assets/check-icon.svg";
  notifyMessageElement.style.display = "block";
  notifyMessageElement.style.backgroundColor = "rgba(121, 158, 41, 1)";
  labelNotifyMessageElement.style.color = "white";
}

function validateForm() {
  const form = getFormInputValues();

  if (!form.newPassword && !form.confirmPassword) {
    showErrorBorderColor();
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

Object.values(formFields).forEach((field) => {
  field.addEventListener("focus", () => {
    hideErrorBorderColor();
  });
});

sendButton.addEventListener("click", function () {
  const form = getFormInputValues();

  if (validateForm()) {
    updateUserAccount(form).then((data) => {
      if (data.status === "success") {
        displaySuccessMessage(data.message);
        setTimeout(() => {
          resetFormInputValues();
          window.location.href = "login.html";
        }, 2000);
      } else {
        showErrorBorderColor();
        displayErrorMessage(data.message);
      }
    });
  }
});
