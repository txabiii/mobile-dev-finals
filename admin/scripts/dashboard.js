import { logoutAccount, getUserAccount } from "./api/userAccountAPI.js";
import { getPlant } from "./api/plantApi.js"
import { getPosts } from "./api/postAPI.js"
import { getReports } from "./api/reportApi.js";
import { getUserPlants } from "./api/userPlantsApi.js";


var accStorage = new Array(); 
var plantStorage = new Array(); 
var postStorage = new Array(); 
var analyticsActiveID = 1;

function draw1() {
  var data = new google.visualization.DataTable();

  if (analyticsActiveID == 1){
    var now = new Date();
    data.addColumn('date', 'X');
    data.addColumn('number', 'New Users');

    for (let i = 2; i > 0; i--){
      var matches = 0;
      var priorDate  = new Date(new Date().setDate(now.getDate() - i));
      accStorage.forEach(element => {
        var matchingDate = new Date(element["date_created"]);
         if (priorDate.toDateString() === matchingDate.toDateString()) {
           matches = matches + 1;
         }
      });
      //console.log("Current Date: " + priorDate.toDateString() + " " + matches);
      data.addRows([[priorDate, matches]])
    }
  
    var options = {
        legend: 'none',
        series: {
            0: { color: '#054d3b' },
        },
        hAxis: {
        format: 'hh a',
        gridlines: {count: 12}
        },
        'chartArea': {'width': '80%', 'height': '80%'},
    };
  }
  else if(analyticsActiveID == 2){

  }
  else {
    var now = new Date();
  
    data.addColumn('date', 'X');
    data.addColumn('number', 'Posts Added');

    for (let i = 2; i > 0; i--){
      var matches = 0;
      var priorDate  = new Date(new Date().setDate(now.getDate() - i));
      postStorage.forEach(element => {
        var matchingDate = new Date(element["datetime_posted"]);
         if (priorDate.toDateString() === matchingDate.toDateString()) {
           matches = matches + 1;
         }
      });
      // console.log("Current Date: " + priorDate.toDateString() + " " + matches + " | " + analyticsActiveID);
      data.addRows([[priorDate, matches]])
    }
  
  
    var options = {
        legend: 'none',
        series: {
            0: { color: '#054d3b' },
        },
        hAxis: {
        format: 'MMM dd',
        gridlines: {count: 15}
        },
        'chartArea': {'width': '80%', 'height': '80%'},
    };    
  }


  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}

function draw7() {
  var data = new google.visualization.DataTable();

  if (analyticsActiveID == 1){
    var now = new Date();
    data.addColumn('date', 'X');
    data.addColumn('number', 'New Users');
  
    for (let i = 7; i > 0; i--){
      var matches = 0;
      var priorDate  = new Date(new Date().setDate(now.getDate() - i));
      accStorage.forEach(element => {
        var matchingDate = new Date(element["date_created"]);
         if (priorDate.toDateString() === matchingDate.toDateString()) {
           matches = matches + 1;
         }
      });
      //console.log("Current Date: " + priorDate.toDateString() + " " + matches);
      data.addRows([[priorDate, matches]])
    }
  
    var options = {
        legend: 'none',
        series: {
            0: { color: '#054d3b' },
        },
        hAxis: {
        format: 'MMM dd, hh a',
        gridlines: {count: 7}
        },
        'chartArea': {'width': '80%', 'height': '80%'},
    };
  }
  else if(analyticsActiveID == 2){

  }
  else {
    var now = new Date();
  
    data.addColumn('date', 'X');
    data.addColumn('number', 'Posts Added');

    for (let i = 7; i > 0; i--){
      var matches = 0;
      var priorDate  = new Date(new Date().setDate(now.getDate() - i));
      postStorage.forEach(element => {
        var matchingDate = new Date(element["datetime_posted"]);
         if (priorDate.toDateString() === matchingDate.toDateString()) {
           matches = matches + 1;
         }
      });
      // console.log("Current Date: " + priorDate.toDateString() + " " + matches + " | " + analyticsActiveID);
      data.addRows([[priorDate, matches]])
    }
  
  
    var options = {
        legend: 'none',
        series: {
            0: { color: '#054d3b' },
        },
        hAxis: {
        format: 'MMM dd',
        gridlines: {count: 7}
        },
        'chartArea': {'width': '80%', 'height': '80%'},
    };
  }

  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}


function draw30() {
  var data = new google.visualization.DataTable();
  
  if (analyticsActiveID == 1){
    var now = new Date();
  
    data.addColumn('date', 'X');
    data.addColumn('number', 'New Users');

    for (let i = 30; i > 0; i--){
      var matches = 0;
      var priorDate  = new Date(new Date().setDate(now.getDate() - i));
      accStorage.forEach(element => {
        var matchingDate = new Date(element["date_created"]);
         if (priorDate.toDateString() === matchingDate.toDateString()) {
           matches = matches + 1;
         }
      });
      //console.log("Current Date: " + priorDate.toDateString() + " " + matches);
      data.addRows([[priorDate, matches]])
    }
  
  
    var options = {
        legend: 'none',
        series: {
            0: { color: '#054d3b' },
        },
        hAxis: {
        format: 'MMM dd',
        gridlines: {count: 15}
        },
        'chartArea': {'width': '80%', 'height': '80%'},
    };
  }
  else if(analyticsActiveID == 2){
    var now = new Date();
  
    data.addColumn('date', 'X');
    data.addColumn('number', 'Plants Added');

    for (let i = 30; i > 0; i--){
      var matches = 0;
      var priorDate  = new Date(new Date().setDate(now.getDate() - i));
      console.log(plantStorage)
      plantStorage.forEach(element => {
        var matchingDate = new Date(element["datetime_added"]);
         if (priorDate.toDateString() === matchingDate.toDateString()) {
           matches = matches + 1;
         }
      });
      // console.log("Current Date: " + priorDate.toDateString() + " " + matches + " | " + analyticsActiveID);
      data.addRows([[priorDate, matches]])
    }
  
  
    var options = {
        legend: 'none',
        series: {
            0: { color: '#054d3b' },
        },
        hAxis: {
        format: 'MMM dd',
        gridlines: {count: 15}
        },
        'chartArea': {'width': '80%', 'height': '80%'},
    };
  }
  else {
    var now = new Date();
  
    data.addColumn('date', 'X');
    data.addColumn('number', 'Posts Added');

    for (let i = 30; i > 0; i--){
      var matches = 0;
      var priorDate  = new Date(new Date().setDate(now.getDate() - i));
      postStorage.forEach(element => {
        var matchingDate = new Date(element["datetime_posted"]);
         if (priorDate.toDateString() === matchingDate.toDateString()) {
           matches = matches + 1;
         }
      });
      // console.log("Current Date: " + priorDate.toDateString() + " " + matches + " | " + analyticsActiveID);
      data.addRows([[priorDate, matches]])
    }
  
  
    var options = {
        legend: 'none',
        series: {
            0: { color: '#054d3b' },
        },
        hAxis: {
        format: 'MMM dd',
        gridlines: {count: 15}
        },
        'chartArea': {'width': '80%', 'height': '80%'},
    };
  }



  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}

const newUsersButton = document.getElementById("new_users");
const popularPlantButton = document.getElementById("popular_plant");
const postCountButton = document.getElementById("post_number");

newUsersButton.addEventListener("click", function () {
  newUsersButton.style.fontWeight = "700";
  newUsersButton.style.textDecoration = "underline";
  popularPlantButton.style.fontWeight = "500";
  popularPlantButton.style.textDecoration = "none";
  postCountButton.style.fontWeight = "500";
  postCountButton.style.textDecoration = "none";
  analyticsActiveID = 1;
  draw1();
});

popularPlantButton.addEventListener("click", function () {
  newUsersButton.style.fontWeight = "500";
  newUsersButton.style.textDecoration = "none";
  popularPlantButton.style.fontWeight = "700";
  popularPlantButton.style.textDecoration = "underline";
  postCountButton.style.fontWeight = "500";
  postCountButton.style.textDecoration = "none";
  analyticsActiveID = 2;
  draw7();
});

postCountButton.addEventListener("click", function () {
  newUsersButton.style.fontWeight = "500";
  newUsersButton.style.textDecoration = "none";
  popularPlantButton.style.fontWeight = "500";
  popularPlantButton.style.textDecoration = "none";
  postCountButton.style.fontWeight = "700";
  postCountButton.style.textDecoration = "underline";
  analyticsActiveID = 3;
  draw30();
});

const last1Button = document.getElementById("last_1");
const last7Button = document.getElementById("last_7");
const last30Button = document.getElementById("last_30");

last1Button.addEventListener("click", function () {
  last1Button.style.fontWeight = "700";
  last1Button.style.textDecoration = "underline";
  last7Button.style.fontWeight = "500";
  last7Button.style.textDecoration = "none";
  last30Button.style.fontWeight = "500";
  last30Button.style.textDecoration = "none";
  draw1();
});

last7Button.addEventListener("click", function () {
  last1Button.style.fontWeight = "500";
  last1Button.style.textDecoration = "none";
  last7Button.style.fontWeight = "700";
  last7Button.style.textDecoration = "underline";
  last30Button.style.fontWeight = "500";
  last30Button.style.textDecoration = "none";
  draw7();
});

last30Button.addEventListener("click", function () {
  last1Button.style.fontWeight = "500";
  last1Button.style.textDecoration = "none";
  last7Button.style.fontWeight = "500";
  last7Button.style.textDecoration = "none";
  last30Button.style.fontWeight = "700";
  last30Button.style.textDecoration = "underline";
  draw30();
});

function savePosts(posts){
  postStorage = posts
}

function savePlants(plants){
  plantStorage = plants
}

function saveAccounts(accounts){
  accStorage = accounts; 
  google.charts.setOnLoadCallback(draw7);
  //console.log(accounts[1]);
}


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

    const dashboardInfo = {
      user_num: document.getElementById("user_num"),
      plant_num: document.getElementById("plant_num"),
      post_num: document.getElementById("post_num"),
      report_num: document.getElementById("report_num")
    };

    getUserAccount({
      action:"get-all-users"
    }).then((data) => {
      dashboardInfo.user_num.innerHTML = data.length
      //console.log("userCount: " + data.length)
      saveAccounts(data);
    })

    getPlant({
      action:"get-all-plants"
    }).then((data) => {
      dashboardInfo.plant_num.innerHTML = data.length
      //console.log("plantCount: " + data.length)
    })

    getUserPlants({
      action:"get-all-user-plants"
    }).then((data) => {
      savePlants(data);
      //console.log(data);
    })

    getPosts().then((data) => {
      dashboardInfo.post_num.innerHTML = data.posts.length
      savePosts(data.posts);
      //console.log("postCount: " + data.posts.length)
    })

    getReports({
      action:"get-all-reports"
    }).then((data) => {
      dashboardInfo.report_num.innerHTML = data.data.length
    })


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