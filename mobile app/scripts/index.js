document.addEventListener("click", function (event) {
  if (event.target.matches("#login-button")) {
    window.location.href = "login.html";
  } else {
    window.location.href = "signup.html";
  }
});
