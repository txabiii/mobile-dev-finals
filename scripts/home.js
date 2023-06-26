import { myPlantsData, allPlantsData, userData } from './data.js';
import { getWaterReminder } from './utils.js';
import { getPosts, createPost } from './api/postApi.js'

/**
 * Displays the plants of the user
 * 
 * @param {array} plants - An array of objects of the user's plants data
 * @returns {void}
 */

function displayMyPlants(plants) {
  const template = document.getElementById("plant-item-template");
  const container = document.getElementById("my-plants");
  const noPlantsContainer = document.getElementById("no-plants");

  if (myPlantsData.length === 0) {
    container.style.display = "none"
    noPlantsContainer.style.display = "flex"
    return;
  } else {
    container.style.display = "block"
    noPlantsContainer.style.display = "none"
  }

  for (const plant of plants) {
    const plantItem = template.content.cloneNode(true);

    const nameElement = plantItem.querySelector(".name");
    nameElement.textContent = plant.name;

    const waterScheduleElement = plantItem.querySelector(".water-schedule");
    waterScheduleElement.textContent = getWaterReminder(plant.id)
    
    const imageElement = plantItem.querySelector("img");
    imageElement.src = plant.image_url;

    nameElement.addEventListener("click", function() {
      window.location.href = "/own-plant.html?plant_id=" + plant.id;
    });

    container.appendChild(plantItem);
  }
}

displayMyPlants(myPlantsData);

/**
 * Display all the plants in the database
 */

function displayAllPlants() {
  const template = document.getElementById("plant-item-template");
  const container = document.getElementById("explore-plants");

  for (const plant of allPlantsData) {
    const plantItem = template.content.cloneNode(true);

    const nameElement = plantItem.querySelector(".name");
    nameElement.textContent = plant.name;

    const waterScheduleElement = plantItem.querySelector(".water-schedule");
    if(plant.watering_frequency === 1) 
      waterScheduleElement.textContent = 'Water everyday'
    else waterScheduleElement.textContent = `Water every ${plant.watering_frequency} days`;

    const imageElement = plantItem.querySelector("img");
    imageElement.src = plant.image_url;

    nameElement.addEventListener("click", function() {
      window.location.href = "/explore-plant.html?plant_id=" + plant.id;
    });

    container.appendChild(plantItem);
  }
}

displayAllPlants();

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
getPosts().then(({posts}) => {
  plantParentsPosts = posts;

  displayPlantParentsPosts(plantParentsPosts);
});

/**
 * Displays each post from the `plantParentsPosts` array.
 * @param {array} posts - An array of objects containing the posts' data 
 */
function displayPlantParentsPosts(posts) {
  const postTemplate = document.getElementById("post-template");
  const postsContainer = document.getElementById("posts-list");

  postsContainer.innerHTML = ''

  for (const post of posts) {
    const postElement = postTemplate.content.cloneNode(true);
    const profileImage = postElement.querySelector("img");
    const postContent = postElement.querySelector(".text");
    const postCreator = postElement.querySelector(".username");

    if(post.profile_image_url === null) profileImage.src = "./assets/missing-profile-image.png";
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

    postContent.textContent = post.content;
    postCreator.textContent = post.username;
    postsContainer.appendChild(postElement);
  }

  postsContainer.scrollTop = postsContainer.scrollHeight;
}

/**
 * The input element for entering the post content.
 * @type {HTMLElement}
 */
const inputElement = document.getElementById('post-input');

/**
 * Adds a new post by retrieving the content from the input element,
 * creating a post using the `createPost` function, and updating the UI with the new post.
 * @returns {Promise} A promise that resolves when the post is successfully created and displayed.
 */
function addPost() {
  const content = inputElement.value;
  const now = new Date();

  createPost(userData.id, content, now)
  .then(()=>{
    const newPost = {
      content : content,
      id: userData.id,
      profile_image_url: userData.profile_image_url,
      user_id: userData.id,
      username: userData.username
    }

    plantParentsPosts.unshift(newPost);

    inputElement.value = '';

    displayPlantParentsPosts();
  });
}

/**
 * Adds an event listener to the input element to capture the "Enter" key press event and trigger the `addPost` function.
 * @param {Event} event - The key press event object.
 */
inputElement.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') addPost();
});
