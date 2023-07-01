import { addUserAccount } from "./api/userAccountAPI.js";
import {
  showErrorBorderColor,
  displayErrorMessage,
  displaySuccessMessage,
  addFocusEventListenerToFields,
  redirectWithTimeout,
} from "./utils.js";

const signUpButton = document.getElementById("signup-button");
const signInButton = document.getElementById("sign-in");
const formFields = {
  username: document.getElementById("username-input"),
  email: document.getElementById("email-input"),
  password: document.getElementById("password-input"),
  confirmPassword: document.getElementById("confirm-password-input"),
};

addFocusEventListenerToFields(formFields);

function getFormInputValues() {
  return {
    action: "signup",
    username: formFields.username.value.trim(),
    email: formFields.email.value.trim(),
    password: formFields.password.value.trim(),
    confirmPassword: formFields.confirmPassword.value.trim(),
  };
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
    showErrorBorderColor(formFields);
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

signUpButton.addEventListener("click", function () {
  const form = getFormInputValues();

  if (validateRegistrationForm()) {
    addUserAccount(form).then((data) => {
      if (data.status === "success") {
        localStorage.setItem("user_data", JSON.stringify(data.data));
        displaySuccessMessage(data.message);
        redirectWithTimeout(formFields, "verification.html");
      } else {
        showErrorBorderColor(formFields);
        displayErrorMessage(data.message);
      }
    });
  }
});

signInButton.addEventListener("click", function () {
  window.location.href = "login.html";
});
