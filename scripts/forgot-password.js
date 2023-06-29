import { getUserAccount } from "./api/userAccountAPI.js";

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
    action: "search_email_address",
    email: document.getElementById("email-input").value.trim(),
  };
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (!emailValue.email) {
    email.classList.add("error");
    displayErrorMessage("Please enter your email address.");
  } else if (!emailRegex.test(emailValue.email)) {
    email.classList.add("error");
    displayErrorMessage("Please enter a valid email address.");
  } else {
    getUserAccount(emailValue).then((data) => {
      sessionStorage.setItem("user_id", data.user_id);

      if (data.status === "success") {
        displaySuccessMessage(data.message);

        // setTimeout(() => {
        //   emailValue.email = "";
        //   window.location.href = "home.html";
        // }, 2000);
      } else {
        email.classList.add("error");
        displayErrorMessage(data.message);
      }
    });
  }
});
