// var forgotPassword = document.querySelectorAll(".label-forgot-password");
// var signUp = document.querySelectorAll(".label-sign-up");

// forgotPassword.forEach(function (label) {
//   label.addEventListener("click", function () {
//     // Custom action to perform when label is clicked
//     alert("Label clicked!");
//   });
// });

// signUp.forEach(function (label) {
//   label.addEventListener("click", function () {
//     // Custom action to perform when label is clicked
//     alert("Label clicked!");
//   });
// });

var clickableLabels = document.querySelectorAll(".label-sign-up");

clickableLabels.forEach(function (label) {
  label.addEventListener("click", function () {
    // Custom action to perform when label is clicked
    alert("Label clicked!");
  });
});

var socialMediaLinks = document.querySelectorAll(".social-media-links img");
socialMediaLinks.forEach(function (socialMedia) {
  socialMedia.addEventListener("click", function () {
    // Get the alt attribute of the clicked image
    var altText = socialMedia.alt;

    // Perform different actions based on the alt text
    switch (altText) {
      case "google":
        window.location.href = "https://www.google.com";
        break;
      case "facebook":
        window.location.href = "https://www.facebook.com";
        break;
      case "apple":
        window.location.href = "https://www.apple.com";
        break;
      // Add more cases for other alt texts if needed
    }
  });
});
