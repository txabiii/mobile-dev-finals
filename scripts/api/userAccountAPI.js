export function getUserAccount(payload) {
  return new Promise((resolve, reject) => {
    const url = `./php/user-account.php?email=${encodeURIComponent(
      payload.email
    )}&action=${encodeURIComponent(payload.action)}`;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
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

export function addUserAccount(payload) {
  return new Promise((resolve, reject) => {
    fetch("./php/user-account.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
    fetch("./php/user-account.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
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
    fetch("./php/user-account.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
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
    fetch("./php/user-account.php", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
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
    fetch("./php/user-account.php", {
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
