document.addEventListener("click", function (event) {
  if (event.target.matches("#sign-in")) {
    window.location.href = "login.html";
  }
});

// var socialMediaLinks = document.querySelectorAll(".social-media-links img");
// socialMediaLinks.forEach(function (socialMedia) {
//   socialMedia.addEventListener("click", function () {
//     // Get the alt attribute of the clicked image
//     var altText = socialMedia.alt;

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
