import { logoutAccount } from "../../scripts/api/userAccountAPI.js";
import { generateDateTimeGreeting, displayResultPopup } from "./utils.js";
import { getTips, updateTip, deleteTip, createTip } from './api/tipsApi.js';

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

  /**
   * plant_id, title, content
   */

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

    const headerElement = this.document.querySelector('.header-text');
    headerElement.innerHTML = `Hello, ${userData.username}`

    const datetimeElement = this.document.querySelector('.header-subtext');
    datetimeElement.textContent = generateDateTimeGreeting();
});

const urlParameters = new URLSearchParams(window.location.search);
const plantId = urlParameters.get("plant_id");
const plantName = urlParameters.get("plant_name");

const tipsLabel = document.querySelector('.page-name');
tipsLabel.textContent = `${plantName} Tips Management`

const template = document.querySelector('.tips-table-row-template');
const tableBody = document.querySelector('#table-body')

getTips({
  action: 'get-plant-tips',
  plantId: plantId
})
.then((data) => {
  for(const tip of data) {
    const clone = document.importNode(template.content, true);

    const tipId = clone.querySelector('[name="tip-id"]');
    const tipTitleInput = clone.querySelector('[name="tip-title-input"]');
    const contentInput = clone.querySelector('[name="tip-content-input"]');
    const editButton = clone.querySelector('#edit');
    const deleteButton = clone.querySelector('#delete');
  
    tipId.textContent = tip.tip_id;
    tipTitleInput.value = tip.title;
    contentInput.value = tip.content;

    editButton.addEventListener("click", () => {
      updateTip({
        tipId: tip.tip_id,
        title: tipTitleInput.value,
        content: contentInput.value
      })
      .then(() => {
        displayResultPopup({success: true, message: 'Tip updated successfully'})
      })
    })

    deleteButton.addEventListener("click", () => {
      deleteTip(tip.tip_id)
      .then(() => location.reload())
    })

    tableBody.appendChild(clone)
  }
})

const newTipTitleInput = document.querySelector('#new-tip-title-input');
const newTipContentInput = document.querySelector('[name="new-tip-content-input"]');
const addNewTipButton = document.querySelector('#add-new-tip');
addNewTipButton.addEventListener("click", () => {
  createTip({
    action: 'create-tip',
    plantId: plantId,
    title: newTipTitleInput.value,
    content: newTipContentInput.value
  })
  .then(() => {
    setTimeout(() => {
      location.reload();
    }, 3000);
  })
})

