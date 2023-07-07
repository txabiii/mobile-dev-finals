import { logoutAccount, getUserAccount } from "./api/userAccountAPI.js";
import { getPlant } from "./api/plantApi.js"
import { getPosts } from "./api/postAPI.js"
import { getReports } from "./api/reportApi.js";


google.charts.setOnLoadCallback(draw7);
var accStorage = new Array(); 

function draw1() {
  var data = new google.visualization.DataTable();
  data.addColumn('date', 'X');
  data.addColumn('number', 'New Users');

  data.addRows([
      [new Date(2023, 6, 6), 5],  [new Date.now(), 10]
  ]);

  var options = {
      legend: 'none',
      series: {
          0: { color: '#054d3b' },
      },
      hAxis: {
      format: 'MMM dd, yyyy',
      gridlines: {count: 12}
      },
      'chartArea': {'width': '80%', 'height': '80%'},
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}

function draw7() {
  var data = new google.visualization.DataTable();
  data.addColumn('date', 'X');
  data.addColumn('number', 'New Users');

  data.addRows([
      [new Date(2023, 5, 29), 5],  [new Date(2023, 5, 30), 10], [new Date(2023, 6, 1), 5],
      [new Date(2023, 6, 2), 15], [new Date(2023, 6, 3), 10], [new Date(2023, 6, 4), 30],
      [new Date(2023, 6, 5), 25]
  ]);

  var options = {
      legend: 'none',
      series: {
          0: { color: '#054d3b' },
      },
      hAxis: {
      format: 'MMM dd, yyyy',
      gridlines: {count: 7}
      },
      'chartArea': {'width': '80%', 'height': '80%'},
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}


function draw30() {
  var now = new Date();
  var data = new google.visualization.DataTable();
  data.addColumn('date', 'X');
  data.addColumn('number', 'New Users');

  for (let i = 30; i > 0; i--){
    var priorDate  = new Date(new Date().setDate(now.getDate() - i));
    accStorage.forEach(element => console.log(element));
    //var count = 0;
      //var count = accStorage.filter(x => x === "2023-06-26 08:09:19").length;
      //console.log(count);
    //var curDate = new Date(accStorage[0]["date_created"]).toDateString();
    data.addRows([[priorDate, i]])
  }


  var options = {
      legend: 'none',
      series: {
          0: { color: '#054d3b' },
      },
      hAxis: {
      format: 'MMM dd, yyyy',
      gridlines: {count: 30}
      },
      'chartArea': {'width': '80%', 'height': '80%'},
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}

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


function saveAccounts(accounts){
  accStorage = accounts;
  console.log(accounts[1]);
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
      console.log("userCount: " + data.length)
      saveAccounts(data);
    })

    getPlant({
      action:"get-all-plants"
    }).then((data) => {
      dashboardInfo.plant_num.innerHTML = data.length
      console.log("plantCount: " + data.length)
    })

    getPosts().then((data) => {
      dashboardInfo.post_num.innerHTML = data.posts.length
      console.log("postCount: " + data.posts.length)
    })

    getReports({
      action:"get-all-reports"
    }).then((data) => {
      dashboardInfo.report_num.innerHTML = data.data.length
      console.log("reportCount: " + data.data.length)
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