import { SERVER_URL } from "../../../mobile app/scripts/config.js";

export function getUserAccount(payload) {
  return new Promise((resolve, reject) => {
    fetch(SERVER_URL + `/user-account.php?action=${payload.action}`)
      .then(response => response.json())
      .then(result => {
        resolve(result.data)
      }) 
      .catch(error => {        
        reject(error)
      });
  });
}

export function addUserAccount(payload) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/user-account.php`, {
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function loginAccount(payload) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/user-account.php`, {
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function logoutAccount(payload) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/user-account.php`, {
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function updateUserAccount(payload) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/user-account.php`, {
      method: "PUT",
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function updateUserCredentials(payload) {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}/user-account.php`, {
      method: "POST",
      body: payload,
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
