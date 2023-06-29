import { getUserAccount, updateUserAccount } from "./api/userAccountAPI.js";

const backButton = document.getElementById("back-button");
const sendButton = document.getElementById("send-button");
const notifyMessageElement = document.getElementById("notify-message");
const labelNotifyMessageElement = document.getElementById(
  "label-notify-message"
);
const notifyIconElement = document.getElementById("notify-icon");
const email = document.getElementById("email-input");

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

email.addEventListener("focus", () => {
  notifyMessageElement.style.display = "none";
  email.classList.remove("error");
});

backButton.addEventListener("click", function () {
  window.location.href = "login.html";
});

sendButton.addEventListener("click", function () {
  const emailValue = {
    action: "forgot_password",
    email: document.getElementById("email-input").value.trim(),
  };
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (!emailValue.email) {
    email.classList.add("error");
    displayErrorMessage("Please enter your email address.");
    return;
  } else if (!emailRegex.test(emailValue.email)) {
    email.classList.add("error");
    displayErrorMessage("Please enter a valid email address.");
    return;
  } else {
    getUserAccount(emailValue).then((data) => {
      if (data.status === "success") {
        sessionStorage.setItem("user_data", JSON.stringify(data.data));
        const userData = JSON.parse(sessionStorage.getItem("user_data"));

        updateUserAccount(userData).then((data) => {
          if (data.status === "success") {
            displaySuccessMessage(data.message);
            setTimeout(() => {
              emailValue.email = "";
              window.location.href = "verification.html";
            }, 2000);
          } else {
            showErrorBorderColor();
            displayErrorMessage(data.message);
          }
        });
      } else {
        email.classList.add("error");
        displayErrorMessage(data.message);
      }
    });
  }
});
