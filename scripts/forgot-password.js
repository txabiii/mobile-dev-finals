import { getUserAccount, updateUserAccount } from "./api/userAccountAPI.js";
import {
  displayErrorMessage,
  displaySuccessMessage,
  notifyElements,
} from "./utils.js";

const backButton = document.getElementById("back-button");
const sendButton = document.getElementById("send-button");
const email = document.getElementById("email-input");

email.addEventListener("focus", () => {
  notifyElements.notifyMessageElement.style.display = "none";
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
        localStorage.setItem("user_data", JSON.stringify(data.data));
        const userData = JSON.parse(localStorage.getItem("user_data"));
        displaySuccessMessage(data.message);

        updateUserAccount(userData).then((data) => {
          if (data.status === "success") {
            displaySuccessMessage(data.message);
            setTimeout(() => {
              emailValue.email = "";
              window.location.href = "verification.html";
            }, 2000);
          } else {
            email.classList.add("error");
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
