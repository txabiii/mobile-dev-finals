import { loginAccount } from "./api/userAccountAPI.js";

const loginButton = document.getElementById("login-button");

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
    usernameOrEmail: document.getElementById("username-input").value.trim(),
    password: document.getElementById("password-input").value.trim(),
  };
}

function resetFormInputValues() {
  document.getElementById("username-input").value = "";
  document.getElementById("password-input").value = "";
}

function addError() {
  Object.values(formFields).forEach((field) => {
    field.classList.add("error");
  });
}

function removeError() {
  Object.values(formFields).forEach((field) => {
    field.classList.remove("error");
  });
}

function validateLoginForm() {
  const form = getFormInputValues();

  if (!form.usernameOrEmail && !form.password) {
    alert("Please fill out the fields");
    addError();
    return false;
  } else if (!form.usernameOrEmail) {
    alert("Please enter a username or email address.");
    formFields.usernameOrEmail.classList.add("error");
    return false;
  } else if (!form.password) {
    alert("Please enter a password.");
    formFields.password.classList.add("error");
    return false;
  } else {
    return true;
  }
}

Object.values(formFields).forEach((field) => {
  field.addEventListener("focus", () => {
    removeError();
  });
});

loginButton.addEventListener("click", function () {
  if (validateLoginForm()) {
    const form = getFormInputValues();
    loginAccount(form).then((data) => {
      if (data.status === "success") {
        alert(data.data);
        resetFormInputValues();
        window.location.href = "home.html";
      } else {
        alert(data.data);
      }
    });
  }
});

// var socialMediaLinks = document.querySelectorAll(".social-media-links img");
// socialMediaLinks.forEach(function (socialMedia) {
//   socialMedia.addEventListener("click", function () {
//     // Get the alt attribute of the clicked image
//     var altText = socialMedia.alt;

//     // Perform different actions based on the alt text
//     switch (altText) {
//       case "google":
//         window.location.href = "https://www.google.com";
//         break;
//       case "facebook":
//         window.location.href = "https://www.facebook.com";
//         break;
//       case "apple":
//         window.location.href = "https://www.apple.com";
//         break;
//       // Add more cases for other alt texts if needed
//     }
//   });
// });
