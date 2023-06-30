import { updateUserAccount } from "./api/userAccountAPI.js";
import {
  showErrorBorderColor,
  displayErrorMessage,
  displaySuccessMessage,
  addFocusEventListenerToFields,
} from "./utils.js";

const inputs = document.querySelectorAll("input");
const sendButton = document.getElementById("send-button");
const backButton = document.getElementById("back-button");
const resendCodeElement = document.getElementById("label-resend-code");

const userData = JSON.parse(sessionStorage.getItem("user_data"));
const verificationCode = [];

addFocusEventListenerToFields(inputs);

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

backButton.addEventListener("click", function () {
  const lastURL = document.referrer;
  window.location.href = lastURL;
});

resendCodeElement.addEventListener("click", function () {
  const form = {
    action: "resend_code",
    user_id: userData.user_id,
    email: userData.email,
  };

  updateUserAccount(form).then((data) => {
    if (data.status === "success") {
      displaySuccessMessage(data.message);
    } else {
      showErrorBorderColor(inputs);
      displayErrorMessage(data.message);
    }
  });
});

sendButton.addEventListener("click", function () {
  const form = {
    action: "verify_email",
    user_id: userData.user_id,
    verification_code: verificationCode.join(""),
  };
  let redirectURL;

  if (userData.action2 === "forgot_password") {
    redirectURL = "new-password.html";
  } else {
    redirectURL = "login.html";
  }

  updateUserAccount(form).then((data) => {
    if (data.status === "success") {
      displaySuccessMessage(data.message);
      setTimeout(() => {
        window.location.href = redirectURL;
      }, 2000);
    } else {
      showErrorBorderColor(inputs);
      displayErrorMessage(data.message);
    }
  });
});
