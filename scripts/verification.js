import { updateUserAccount } from "./api/userAccountAPI.js";

const inputs = document.querySelectorAll("input");
const sendButton = document.getElementById("send-button");
const userId = parseInt(sessionStorage.getItem("user_id"), 10);
const email = sessionStorage.getItem("email");
const verificationCode = [];
const notifyMessageElement = document.getElementById("notify-message");
const labelNotifyMessageElement = document.getElementById(
  "label-notify-message"
);
const notifyIconElement = document.getElementById("notify-icon");
const resendCodeElement = document.getElementById("label-resend-code");

function getVerificationCodeInputValues() {
  return {
    action: "verify_email",
    user_id: userId,
    verification_code: verificationCode.join(""),
  };
}

function resendCode() {
  return {
    action: "resend_code",
    user_id: userId,
    email: email,
  };
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

function showErrorBorderColor() {
  inputs.forEach((input) => {
    input.classList.add("error");
  });
}

function hideErrorBorderColor() {
  notifyMessageElement.style.display = "none";

  inputs.forEach((input) => {
    input.classList.remove("error");
  });
}

inputs.forEach((input) => {
  input.addEventListener("focus", () => {
    hideErrorBorderColor();
  });
});

inputs.forEach((input, index1) => {
  input.addEventListener("keyup", (e) => {
    const currentInput = input,
      nextInput = input.nextElementSibling,
      prevInput = input.previousElementSibling;

    if (currentInput.value.length > 1) {
      currentInput.value = "";
      return;
    }

    if (
      nextInput &&
      nextInput.hasAttribute("disabled") &&
      currentInput.value !== ""
    ) {
      nextInput.removeAttribute("disabled");
      nextInput.focus();
    }

    if (e.key === "Backspace") {
      inputs.forEach((input, index2) => {
        if (index1 <= index2 && prevInput) {
          input.setAttribute("disabled", true);
          input.value = "";
          prevInput.focus();
        }
      });
    }

    verificationCode[index1] = currentInput.value;

    if (!inputs[5].disabled && inputs[5].value !== "") {
      sendButton.classList.add("active");
      return;
    }

    sendButton.classList.remove("active");
  });
});

window.addEventListener("load", () => inputs[0].focus());

resendCodeElement.addEventListener("click", function () {
  const form = resendCode();

  updateUserAccount(form).then((data) => {
    if (data.status === "success") {
      displaySuccessMessage(data.message);
    } else {
      showErrorBorderColor();
      displayErrorMessage(data.message);
    }
  });
});

sendButton.addEventListener("click", function () {
  const form = getVerificationCodeInputValues();

  updateUserAccount(form).then((data) => {
    if (data.status === "success") {
      displaySuccessMessage(data.message);
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    } else {
      showErrorBorderColor();
      displayErrorMessage(data.message);
    }
  });
});
