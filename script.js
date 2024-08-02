const FIREBASE_URL =
  "https://join-e8e95-default-rtdb.europe-west1.firebasedatabase.app/";

let users = [{}];
let dataSet = {};

async function init() {
  await loadUsers();
  sortAllUsers();
  displayUsers();
}

async function loadUsers(path = "/names") {
  let userResponse = await fetch(FIREBASE_URL + path + ".json");
  let responseToJson = await userResponse.json();
  if (responseToJson) {
    Object.keys(responseToJson).forEach((key) => {
      users.push({
        id: key,
        name: responseToJson[key]["name"],
        phone: responseToJson[key]["phone"],
        email: responseToJson[key]["email"],
        color: responseToJson[key]["color"],
        initials: responseToJson[key]["initials"],
      });
    });
  }
}

function sortAllUsers() {
  users.sort((a, b) => a.name.localeCompare(b.name));
}

function displayUsers() {
  // show all users in list / Max
  let contacts = document.getElementById("contact-list");
  contacts.innerHTML = "";
  let currentLetter = "";
  for (let i = 1; i < users.length; i++) {
    let user = users[i];
    let name = user.name;
    let email = user.email;
    let color = user.color;
    let initials = user.initials;

    if (firstletter(i) != currentLetter) {
      contacts.innerHTML += `
            <div class="letter-alph">
              <span>${firstletter(i)}</span>
            </div>
            <div class="separator-contacts"></div>
            `;
      currentLetter = firstletter(i);
    }
    contacts.innerHTML += `<div class="single-contact">
              <div class="cl-avatar" style = "background-color: ${color};">
                <div class="cl-overlay-text">${initials}</div>
              </div>
              <div class="single-contact-details">
                <span>${name}</span>
                <a href="">${email}</a>
              </div>
            </div>`;
  }
}

function firstletter(index) {
  let firstLetter = users[index].name.charAt(0);
  return firstLetter;

} // Max

function showUserDetails(index, element) {
  setUserActive(element);
  // show details of selected user  // Galina
}

function setUserActive(element) {
  // shows user as active in list  // Galina
}

function addNewUser(index) {} // Eduard

function editUser(index) {}

// function deleteUser(index) {}

async function addUser() {
  let nameValue = document.getElementById("name").value;
  let phoneValue = document.getElementById("phone").value;
  let newUser = { name: nameValue, phone: phoneValue };
  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  await postData("/names", newUser);
  await loadUsers("/names");
}

async function postData(path = "/names", data = dataSet) {
  await fetch(FIREBASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
