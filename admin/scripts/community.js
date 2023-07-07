import { logoutAccount } from "../../scripts/api/userAccountAPI.js";
import { getReports, updateReport } from "./api/reportApi.js";
import { debounce } from "./utils.js";

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

/**
 * @type {HTMLTemplateElement}
 */
const rowTemplate = document.querySelector('.report-table-row-template');
const tableBody = document.getElementById('table-body');
const noReportTemplate = document.querySelector('.no-report-template');

/**
 * Displays the report records
 * @param {String} status 
 * @param {String} dateRange 
 */
function displayReports(status = null, dateRange = null, reportId = null) {
  tableBody.innerHTML = '';

  getReports({
    action: 'get-all-reports',
    status: status,
    dateRange: dateRange,
    reportId: reportId
  })
  .then(data => {  
    if(data.report.length === 0) {
      const noResultRow = noReportTemplate.content.cloneNode(true);
      tableBody.appendChild(noResultRow);
    }

    for(const report of data.report) {
      const row =createReportTableRow(report)
      tableBody.appendChild(row);
    }
  })
}

displayReports();

/**
 * Creates a table row HTML element from the input data
 * @param {Object} report
 * @returns {Element} The populated table row element
 */
function createReportTableRow(report) {
  const row = rowTemplate.content.cloneNode(true);

  const reportId = row.querySelector('[name="report-id"]');
  const content = row.querySelector('[name="content"]');
  const reportedUser = row.querySelector('[name="reported user"]');
  const reason = row.querySelector('[name="reason"]');
  const reporterUser = row.querySelector('[name="reporter user"]');
  const action = row.querySelector('[name="action"]');
  const resolveButton = action.querySelector('#resolve');
  const deleteButton = action.querySelector('#delete');
  
  reportId.textContent = report.report_id;
  content.textContent = report.content;
  reportedUser.textContent = `#${report.reported_user_id} - ${report.reported_username}`;
  reason.textContent = report.reason;
  reporterUser.textContent = `#${report.reporter_id} - ${report.reporter_username}`;
  resolveButton.addEventListener("click", () => {
    updateReport({
      action: 'resolve-report',
      reportId: report.report_id
    })
  })
  deleteButton.addEventListener("click", () => {
    updateReport({
      action: 'resolve-report-and-delete-post',
      reportId: report.report_id,
      postId: report.post_id
    })
  })

  return row;
}

// Get the select element
const dateRangeSelect = document.getElementById('report-date');

// Add event listener to handle changes
dateRangeSelect.addEventListener('change', handleDateRangeChange);

let dateRange = null;

// Handle the date range change
function handleDateRangeChange() {
  const selectedValue = dateRangeSelect.value;

  switch (selectedValue) {
    case 'today':
      dateRange = 'today';
      break;
    case 'last7':
      dateRange = 'last_7_days';
      break;
    case 'last30':
      dateRange = 'last_30_days';
      break;
    default:
      dateRange = null;
      break;
  }

  displayReports(status, dateRange, reportId);
}

// Get the select element
const reportStatusSelect = document.getElementById('report-status');

// Add event listener to handle changes
reportStatusSelect.addEventListener('change', handleReportStatusChange);

let status = null;

// Handle the report status change
function handleReportStatusChange() {
  const selectedValue = reportStatusSelect.value;

  switch (selectedValue) {
    case 'resolved':
      status = true;
      break;
    case 'unresolved':
      status = false;
      break;
    default:
      status = null;
      break;
  }

  displayReports(status, dateRange, reportId);
}

let reportId = null;

const searchInput = document.getElementById('search-report');

searchInput.addEventListener('input', () => {
  if(!searchInput.value || searchInput.value === '') {
  debounce(
    displayReports(status, dateRange, null)
  , 300)
  };
  debounce(
    displayReports(status, dateRange, searchInput.value)
  , 300)
});