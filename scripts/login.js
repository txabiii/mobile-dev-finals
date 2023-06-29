import { loginAccount } from "./api/userAccountAPI.js";

const loginButton = document.getElementById("login-button");
const notifyMessageElement = document.getElementById("notify-message");
const labelNotifyMessageElement = document.getElementById(
  "label-notify-message"
);
const notifyIconElement = document.getElementById("notify-icon");
const formFields = {
  usernameOrEmail: document.getElementById("username-input"),
  password: document.getElementById("password-input"),
};

document.addEventListener("click", function (event) {
  if (event.target.matches("#sign-up")) {
    window.location.href = "signup.html";
  }
});

function getFormInputValues() {
  return {
    action: "login",
    usernameOrEmail: formFields.usernameOrEmail.value.trim(),
    password: formFields.password.value.trim(),
  };
}

function resetFormInputValues() {
  formFields.usernameOrEmail.value = "";
  formFields.password.value = "";
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

function displayWarningMessage(message) {
  labelNotifyMessageElement.textContent = message;
  notifyIconElement.src = "./assets/exclamation-point-icon.png";
  notifyMessageElement.style.display = "block";
  notifyMessageElement.style.backgroundColor = "rgba(0, 71, 171, 255)";
  labelNotifyMessageElement.style.color = "white";
}

function validateLoginForm() {
  const form = getFormInputValues();

  if (!form.usernameOrEmail && !form.password) {
    showErrorBorderColor();
    displayErrorMessage("Please fill out the fields.");
    return false;
  } else if (!form.usernameOrEmail) {
    formFields.usernameOrEmail.classList.add("error");
    displayErrorMessage("Please enter a username or email address.");
    return false;
  } else if (!form.password) {
    formFields.password.classList.add("error");
    displayErrorMessage("Please enter a password.");
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

loginButton.addEventListener("click", function () {
  const form = getFormInputValues();

  if (validateLoginForm()) {
    loginAccount(form).then((data) => {
      if (data.status === "success") {
        displaySuccessMessage(data.message);

        setTimeout(() => {
          resetFormInputValues();
          window.location.href = "home.html";
        }, 2000);
      } else if (data.status === "warning") {
        displayWarningMessage(data.message);
        sessionStorage.setItem("user_id", data.user_id);
        sessionStorage.setItem("email", data.email);

        setTimeout(() => {
          resetFormInputValues();
          window.location.href = "verification.html";
        }, 2000);
      } else {
        showErrorBorderColor();
        displayErrorMessage(data.message);
      }
    });
  }
});
