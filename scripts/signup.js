const baseURL =
  "http://localhost/mobile-dev-finals/scripts/php/user-account.php";
const signUpButton = document.getElementById("signup-button");

document.addEventListener("click", function (event) {
  if (event.target.matches("#sign-in")) {
    window.location.href = "login.html";
  }
});

function validateRegistrationForm() {
  const inputForm = {
    username: document.getElementById("username-input").value,
    email: document.getElementById("email-input").value,
    password: document.getElementById("password-input").value,
    confirmPassword: document.getElementById("confirm-password-input").value,
  };

  if (inputForm.username === "") {
    alert("Please enter a username.");
    return false;
  }

  if (inputForm.email === "") {
    alert("Please enter an email address.");
    return false;
  }

  if (inputForm.password === "") {
    alert("Please enter a password.");
    return false;
  }

  if (inputForm.confirmPassword === "") {
    alert("Please confirm your password.");
    return false;
  }

  if (inputForm.password !== inputForm.confirmPassword) {
    alert("Passwords do not match.");
    return false;
  }

  return true;
}

function addUserAccount(payload) {
  fetch(baseURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Request failed");
      }
    })
    .then((data) => {
      console.log(data.data);
    })
    .catch((error) => {});
}

signUpButton.addEventListener("click", function () {
  const form = {
    username: document.getElementById("username-input").value,
    email: document.getElementById("email-input").value,
    password: document.getElementById("password-input").value,
    confirmPassword: document.getElementById("confirm-password-input").value,
  };

  addUserAccount(form);
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
