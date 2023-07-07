import { logoutAccount } from "../../scripts/api/userAccountAPI.js";

const logoutButton = document.getElementById("logout-button");
logoutButton.addEventListener("click", function () {
    const payload = { action: "logout" };
  
    logoutAccount(payload).then((data) => {
      if (data.status === "success") {
        window.alert("You have logged out.")
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      } else {
        window.alert("There has been an error while logging out.")
      }
    });
  });


window.addEventListener("load", function () {
    const userData = JSON.parse(this.localStorage.getItem("user_data"));
    const userCredentials = {
      username: document.getElementById("actual-username"),
      email: document.getElementById("actual-email-address"),
      profileImgElement: document.getElementById("profile-image"),
    };
    userCredentials.username.innerHTML = userData.username;
    userCredentials.email.innerHTML = userData.email;
  
    if (userData.profile_image_url) {
      userCredentials.profileImgElement.src = userData.profile_image_url;
    }
});