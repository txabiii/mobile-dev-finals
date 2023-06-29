import { userData } from "./data.js";
import { getWaterReminder } from "./utils.js";
import { getPosts, createPost } from "./api/postApi.js";
import { getPlant } from "./api/plantApi.js";
import { getUserPlants } from "./api/userPlantsApi.js";
import { createReport } from "./api/reportApi.js";

/**
 * Waits for the home page to finish loading, retrieves a username from sessionStorage.
 * Display the username followed by an exclamation mark in an HTML element with the ID "name".
 */
window.addEventListener("load", function () {
  const userData = JSON.parse(sessionStorage.getItem("user_data"));
  const usernameElement = document.getElementById("name");
  usernameElement.textContent = userData.username + `!`;
});

/**
 * Get data of user's plants
 * Displays the plants of the user
 * @param {array} plants - An array of objects of the user's plants data
 * @returns {void}
 */
getUserPlants(userData.id).then((userPlants) => {
  const loading = document.querySelector("#my-plants-loading-group");
  loading.style.display = "none";

  displayMyPlants(userPlants);
});

function displayMyPlants(plants) {
  const template = document.getElementById("plant-item-template");
  const container = document.getElementById("my-plants");
  const noPlantsContainer = document.getElementById("no-plants");

  if (plants.length === 0) {
    container.style.display = "none";
    noPlantsContainer.style.display = "flex";
    return;
  } else {
    container.style.display = "block";
    noPlantsContainer.style.display = "none";
  }

  for (const plant of plants) {
    const plantItem = template.content.cloneNode(true);

    const nameElement = plantItem.querySelector(".name");
    nameElement.textContent = plant.name;

    const waterScheduleElement = plantItem.querySelector(".water-schedule");
    waterScheduleElement.textContent = getWaterReminder(plant);

    const imageElement = plantItem.querySelector("img");
    imageElement.src = plant.image_url;

    nameElement.addEventListener("click", function () {
      window.location.href = "own-plant.html?plant_id=" + plant.plant_id;
    });

    container.appendChild(plantItem);
  }
}

/**
 * An array that holds the plants' details.
 * @type {Array}
 */
var allPlantsData = new Array();

/**
 * Gets all plants using `getPlant`
 * Display them accordingly
 */
getPlant().then((plants) => {
  const loading = document.querySelector("#explore-plants-loading-group");
  loading.style.display = "none";

  allPlantsData = plants;
  displayAllPlants();
});

function displayAllPlants() {
  const template = document.getElementById("plant-item-template");
  const container = document.getElementById("explore-plants");

  for (const plant of allPlantsData) {
    const plantItem = template.content.cloneNode(true);

    const nameElement = plantItem.querySelector(".name");
    nameElement.textContent = plant.name;

    const waterScheduleElement = plantItem.querySelector(".water-schedule");
    if (plant.watering_frequency === 1)
      waterScheduleElement.textContent = "Water everyday";
    else
      waterScheduleElement.textContent = `Water every ${plant.watering_frequency} days`;

    const imageElement = plantItem.querySelector("img");
    imageElement.src = plant.image_url;

    nameElement.addEventListener("click", function () {
      window.location.href = "explore-plant.html?plant_id=" + plant.plant_id;
    });

    container.appendChild(plantItem);
  }
}

/**
 * An array that holds the plant parents' posts.
 * @type {Array}
 */
var plantParentsPosts = new Array();

/**
 * Retrieves the posts using `getPosts` function and assigns them to the `plantParentsPostsArray`
 * Calls the `displayPlantParentsPosts` to display the posts in the UI
 * @returns {Promise} A promise that resolves when the posts are retrieved and assigned.
 */
getPosts().then(({ posts }) => {
  plantParentsPosts = posts;
  displayPlantParentsPosts();
});

/**
 * Displays each post from the `plantParentsPosts` array.
 * @param {array} posts - An array of objects containing the posts' data
 */
function displayPlantParentsPosts() {
  const postTemplate = document.getElementById("post-template");
  const postsContainer = document.getElementById("posts-list");

  postsContainer.innerHTML = "";

  for (const post of plantParentsPosts) {
    const postElement = postTemplate.content.cloneNode(true);
    const profileImage = postElement.querySelector("img");
    const postContent = postElement.querySelector(".text");
    const postCreator = postElement.querySelector(".username");
    const dateTimeElement = postElement.querySelector("#date-time");

    if (post.profile_image_url === null)
      profileImage.src = "./assets/missing-profile-image.png";
    else {
      const img = new Image();
      img.onload = function () {
        profileImage.src = img.src;
      };
      img.onerror = function () {
        profileImage.src = "./assets/missing-profile-image.png";
      };
      img.src = post.profile_image_url;
    }

    const reportElement = postElement.querySelector("#report");
    reportElement.addEventListener("click", () => reportPost(post));
    if (post.user_id == userData.id) reportElement.style.display = "none";

    postContent.textContent = post.content;
    postCreator.textContent = post.username;
    dateTimeElement.textContent = post.datetime_posted;

    const infoElement = postElement.querySelector(".info");
    postContent.addEventListener("click", () => {
      const shown = infoElement.style.display === "flex" ? true : false;
      infoElement.style.display = shown ? "none" : "flex";
      infoElement.style.justifyContent = "space-between";
    });

    postsContainer.appendChild(postElement);
  }

  postsContainer.scrollTop = postsContainer.scrollHeight;
}

/**
 * The input element for entering the post content.
 * @type {HTMLElement}
 */
const inputElement = document.getElementById("post-input");

/**
 * Adds a new post by retrieving the content from the input element,
 * creating a post using the `createPost` function, and updating the UI with the new post.
 * @returns {Promise} A promise that resolves when the post is successfully created and displayed.
 */
function addPost() {
  const content = inputElement.value;
  const now = new Date();
  const formattedDate = now.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  createPost(userData.id, content, now).then((newId) => {
    const newPost = {
      id: newId,
      content: content,
      profile_image_url: userData.profile_image_url,
      user_id: userData.id,
      username: userData.username,
      datetime_posted: formattedDate,
    };

    plantParentsPosts.unshift(newPost);

    inputElement.value = "";

    displayPlantParentsPosts();
  });
}

/**
 * Adds an event listener to the input element to capture the "Enter" key press event and trigger the `addPost` function.
 * @param {Event} event - The key press event object.
 */
inputElement.addEventListener("keypress", function (event) {
  if (event.key === "Enter") addPost();
});

/**
 * Creates a report HTML element
 * @param {object} post
 */
function reportPost(post) {
  const reportTemplate = document.querySelector("#report-template");

  const reportElement = reportTemplate.content.cloneNode(true);

  const reportImgElement = reportElement.querySelector("#user-image");
  const usernameElement = reportElement.querySelector(".username");
  const reportedTextElement = reportElement.querySelector(".text");
  const closeButtonElement = reportElement.querySelector(".close-button");
  const reasonElement = reportElement.querySelector("textarea");
  const submitButtonElement = reportElement.querySelector("#submit-button");
  const body = document.getElementsByTagName("body")[0];

  closeButtonElement.addEventListener("click", () => {
    const removeReportElement = document.querySelector(".report");
    removeReportElement.remove();
  });

  if (post.profile_image_url === null)
    reportImgElement.src = "./assets/missing-profile-image.png";
  else {
    const img = new Image();
    img.onload = function () {
      reportImgElement.src = img.src;
    };
    img.onerror = function () {
      reportImgElement.src = "./assets/missing-profile-image.png";
    };
    img.src = post.profile_image_url;
  }

  usernameElement.textContent = post.username;
  reportedTextElement.textContent = post.content;

  const firstChild = body.firstChild;
  body.insertBefore(reportElement, firstChild);

  submitButtonElement.addEventListener("click", () => {
    createReport(post.id, userData.id, reasonElement.value);
  });
}
