const signUpButton = document.getElementById("signup-button");

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
    username: document.getElementById("username-input").value.trim(),
    email: document.getElementById("email-input").value.trim(),
    password: document.getElementById("password-input").value.trim(),
    confirmPassword: document
      .getElementById("confirm-password-input")
      .value.trim(),
  };
}

function resetFormInputValues() {
  document.getElementById("username-input").value = "";
  document.getElementById("email-input").value = "";
  document.getElementById("password-input").value = "";
  document.getElementById("confirm-password-input").value = "";
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

function validateRegistrationForm() {
  const form = getFormInputValues();
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (
    !form.username &&
    !form.email &&
    !form.password &&
    !form.confirmPassword
  ) {
    alert("Please fill out the fields");
    addError();
    return false;
  } else if (!form.username) {
    alert("Please enter a username.");
    formFields.username.classList.add("error");
    return false;
  } else if (!form.email) {
    alert("Please enter an email address.");
    formFields.email.classList.add("error");
    return false;
  } else if (!emailRegex.test(form.email)) {
    alert("Please enter a valid email address.");
    formFields.email.classList.add("error");
    return false;
  } else if (!form.password) {
    alert("Please enter a password.");
    formFields.password.classList.add("error");
    return false;
  } else if (form.password.length < 8) {
    alert("Password must be at least 8 characters long.");
    formFields.password.classList.add("error");
    return false;
  } else if (!form.confirmPassword) {
    alert("Please confirm your password.");
    formFields.confirmPassword.classList.add("error");
    return false;
  } else if (form.password !== form.confirmPassword) {
    alert("Passwords do not match.");
    formFields.password.classList.add("error");
    formFields.confirmPassword.classList.add("error");
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

function addUserAccount(payload) {
  return new Promise((resolve, reject) => {
    fetch("./php/user-account.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          alert(data.data);
          resetFormInputValues();
        } else {
          alert(data.data);
        }

        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

signUpButton.addEventListener("click", function () {
  if (validateRegistrationForm()) {
    const form = getFormInputValues();
    addUserAccount(form);
  }
});

// var socialMediaLinks = document.querySelectorAll(".social-media-links img");
// socialMediaLinks.forEach(function (socialMedia) {
//   socialMedia.addEventListener("click", function () {
//     // Get the alt attribute of the clicked image
//     const altText = socialMedia.alt;

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
