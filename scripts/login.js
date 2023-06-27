import { loginAccount } from "./api/userAccountAPI.js";

const loginButton = document.getElementById("login-button");
const errorMessageElement = document.getElementById("error-message");
const labelErrorMessageElement = document.getElementById("label-error-message");
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
  errorMessageElement.style.display = "none";

  Object.values(formFields).forEach((field) => {
    field.classList.remove("error");
  });
}

function displayError(message) {
  errorMessageElement.style.display = "block";
  labelErrorMessageElement.textContent = message;
}

function validateLoginForm() {
  const form = getFormInputValues();

  if (!form.usernameOrEmail && !form.password) {
    showErrorBorderColor();
    displayError("Please fill out the fields.");
    return false;
  } else if (!form.usernameOrEmail) {
    formFields.usernameOrEmail.classList.add("error");
    displayError("Please enter a username or email address.");
    return false;
  } else if (!form.password) {
    formFields.password.classList.add("error");
    displayError("Please enter a password.");
    return false;
  } else {
    errorMessageElement.style.display = "none";
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
        resetFormInputValues();
        window.location.href = "home.html";
      } else {
        showErrorBorderColor();
        displayError(data.data);
      }
    });
  }
});
