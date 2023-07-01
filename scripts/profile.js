const editProfile = document.getElementById("label-edit-button");

editProfile.addEventListener("click", function () {
  window.location.href = "edit-profile.html";
});

window.addEventListener("load", function () {
  const userData = JSON.parse(sessionStorage.getItem("user_data"));
  const userCredentials = {
    username: document.getElementById("actual-username"),
    email: document.getElementById("actual-email-address"),
  };
  userCredentials.username.textContent = userData.username;
  userCredentials.email.textContent = userData.email;
});
