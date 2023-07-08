import { getUserPlants } from "./api/userPlantsApi.js";
import { displayUserPlants, toggleAddPlants, makeSearchInputsWork, createPlantSearchResultItem, debounce} from "./utils.js";

const userData = JSON.parse(localStorage.getItem("user_data"));
/**
 * Waits for the home page to finish loading, retrieves the profile image from sessionStorage.
 */
window.addEventListener("load", function () {
  if (userData.profile_image_url) {
    const profileImgElement = document.getElementById("profile-img");
    profileImgElement.src = userData.profile_image_url;
  }
});

/**
 * Select add plant buttons and add the `toggleAddPlants` event
 */
Array.from(document.getElementsByClassName('add-plant-button'))
  .forEach(button => button.addEventListener('click', toggleAddPlants));
  
/**
 * Get data of user's plants
 * Displays the plants of the user
 */
getUserPlants({
  action: "get-all-user-plants",
  userId: userData.user_id,
})
.then((userPlants) => {
  const loading = document.querySelector("#garden-plants-loading-group");
  loading.style.display = "none";

  if (userPlants.length === 0) {
    const myPlant = document.getElementById('my-plants');
    myPlant.style.display = 'none';
    myPlant.style.minHeight = 'unset';

    const noPlantsMessage = document.getElementById("no-plants");
    noPlantsMessage.style.display = "flex";

    const exploreNewPlantsButton =
      document.getElementById("explore-new-plants");
    exploreNewPlantsButton.style.display = "none";
    return;
  }

  displayUserPlants(userPlants);
});

makeSearchInputsWork();

function makeUserPlantSearchInputsWork() {
  const searchSection = document.querySelector('#user-search-plant')

  const searchResultWrapper = searchSection.querySelector("#search-result-wrapper");
  const searchResultList = searchSection.querySelector("#search-result-list");
  const emptySearchResult = searchSection.querySelector(".empty-search-result");
  const searchResultLabel = searchSection.querySelector('#search-result-label');

  const searchInput = searchSection.querySelector(".search-plant-input");
  searchInput.addEventListener("input", debounce(() => {
    searchResultList.innerHTML = '';
  
    if(searchInput.value === '' || searchInput.value.length < 4) {
      searchResultWrapper.style.display = 'none';
      return
    };
    
    getUserPlants({
      action: 'search-user-plants',
      search: searchInput.value,
      userId: userData.user_id
    })
    .then((data) => {
      searchResultWrapper.style.display = 'block';

      for(const plant of data) {
        const resultItem = createPlantSearchResultItem(plant);
        searchResultList.appendChild(resultItem);
      }
    
      const hasResult = data.length !== 0 ? true : false;
    
      emptySearchResult.style.display = hasResult ? 'none' : 'block';
      searchResultLabel.style.display = hasResult ? 'block' : 'none';
    })
  }, 500));
}

makeUserPlantSearchInputsWork();