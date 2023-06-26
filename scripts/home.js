import { myPlantsData, allPlantsData, userData } from './data.js';
import { getWaterReminder } from './utils.js';
import { getPosts, createPost } from './api/postApi.js'

function displayMyPlants() {
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

  for (const plant of myPlantsData) {
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

displayMyPlants()

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

displayAllPlants()

function displayPlantParentsPosts() {
  getPosts().then(({posts}) => {
    console.log(posts)
    const postTemplate = document.getElementById("post-template");
    const postsContainer = document.getElementById("posts-list");
  
    postsContainer.innerHTML = ''
  
    for (const post of posts) {
      const postElement = postTemplate.content.cloneNode(true);
      const profileImage = postElement.querySelector("img");
      const postContent = postElement.querySelector(".text");
      const postCreator = postElement.querySelector(".username");
  
      const img = new Image();
      img.onload = function () {
        profileImage.src = img.src;
      };
      img.onerror = function () {
        profileImage.src = "./assets/missing-profile-image.png";
      };
      img.src = post.profile_image_url;
  
      postContent.textContent = post.content;
      postCreator.textContent = post.username;
      postsContainer.appendChild(postElement);
    }
  
    postsContainer.scrollTop = postsContainer.scrollHeight;
  });
}

displayPlantParentsPosts();

const inputElement = document.getElementById('post-input');

function addPost() {
  const content = inputElement.value;
  
  createPost(userData.id, content).then(() => {
    const newPostId = plantParentsPosts.length;

    const { id: user_id, profile_image_url, username } = userData;
  })
  inputElement.value = '';
}

inputElement.addEventListener('keypress', function(event) {
  if (event.keyCode === 13) {
    addPost();
  }
});