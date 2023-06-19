var clickableLabels = document.querySelectorAll(".label-edit-button");

clickableLabels.forEach(function (label) {
  label.addEventListener("click", function () {
    // Custom action to perform when label is clicked
    alert("Label clicked!");
  });
});
