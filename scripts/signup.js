import { addUserAccount } from "./api/userAccountAPI.js";

const signUpButton = document.getElementById("signup-button");
const notifyMessageElement = document.getElementById("notify-message");
const labelNotifyMessageElement = document.getElementById(
  "label-notify-message"
);
const notifyIconElement = document.getElementById("notify-icon");
const formFields = {
  username: document.getElementById("username-input"),
  email: document.getElementById("email-input"),
  password: document.getElementById("password-input"),
  confirmPassword: document.getElementById("confirm-password-input"),
};

document.addEventListener("click", function (event) {
  if (event.target.matches("#sign-in")) {
    window.location.href = "login.html";
  }
});

function getFormInputValues() {
  return {
    action: "signup",
    username: document.getElementById("username-input").value.trim(),
    email: document.getElementById("email-input").value.trim(),
    password: document.getElementById("password-input").value.trim(),
    confirmPassword: document
      .getElementById("confirm-password-input")
      .value.trim(),
  };
}

function resetFormInputValues() {
  formFields.username.value = "";
  formFields.email.value = "";
  formFields.password.value = "";
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

function validateRegistrationForm() {
  const form = getFormInputValues();
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (
    !form.username &&
    !form.email &&
    !form.password &&
    !form.confirmPassword
  ) {
    showErrorBorderColor();
    displayErrorMessage("Please fill out the fields.");
    return false;
  } else if (!form.username) {
    formFields.username.classList.add("error");
    displayErrorMessage("Please enter a username.");
    return false;
  } else if (!form.email) {
    formFields.email.classList.add("error");
    displayErrorMessage("Please enter an email address.");
    return false;
  } else if (!emailRegex.test(form.email)) {
    formFields.email.classList.add("error");
    displayErrorMessage("Please enter a valid email address.");
    return false;
  } else if (!form.password) {
    formFields.password.classList.add("error");
    displayErrorMessage("Please enter a password.");
    return false;
  } else if (form.password.length < 8) {
    formFields.password.classList.add("error");
    displayErrorMessage("Password must be at least 8 characters long.");
    return false;
  } else if (!form.confirmPassword) {
    formFields.confirmPassword.classList.add("error");
    displayErrorMessage("Please confirm your password.");
    return false;
  } else if (form.password !== form.confirmPassword) {
    formFields.password.classList.add("error");
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

signUpButton.addEventListener("click", function () {
  const form = getFormInputValues();

  if (validateRegistrationForm()) {
    addUserAccount(form).then((data) => {
      if (data.status === "success") {
        displaySuccessMessage(data.message);
        resetFormInputValues();
        sessionStorage.setItem("user_id", data.user_id);
        setTimeout(() => {
          window.location.href = "verification.html";
        }, 2000);
      } else {
        showErrorBorderColor();
        displayErrorMessage(data.message);
      }
    });
  }
});
