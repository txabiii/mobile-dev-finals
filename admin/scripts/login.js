import { loginAccount } from "./api/userAccountAPI.js";
import {
  showErrorBorderColor,
  displayErrorMessage,
} from "./utils.js";

const loginButton = document.getElementById("login-button");
const formFields = {
  usernameOrEmail: document.getElementById("username-input"),
  password: document.getElementById("password-input"),
};

function getFormInputValues() {
  return {
    action: "login",
    usernameOrEmail: formFields.usernameOrEmail.value.trim(),
    password: formFields.password.value.trim(),
  };
}

function validateLoginForm() {
  const form = getFormInputValues();

  if (!form.usernameOrEmail && !form.password) {
    showErrorBorderColor(formFields);
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

loginButton.addEventListener("click", function () {
  const form = getFormInputValues();

  if (validateLoginForm()) {
    loginAccount(form).then((data) => {
      localStorage.setItem("user_data", JSON.stringify(data.data));

      if (data.status === "success") {
        window.alert("Login success.")
        window.location.href = "dashboard.html"
      } else {
        window.alert("There is an error while logging in.")
      }
    });
  }
});
