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
  // sort Users alphabetically / Patrick
  console.log(users);
}

function displayUsers() {
  // show all users in list / Max
  let contacts = document.getElementById("contact-list");
  contacts.innerHTML = "";
  let currentLetter = "";
  for (let i = 0; i < users.length; i++) {
    if (firstletter(i) != currentLetter) {
      contacts.innerHTML += `
            <div class="letter-alph">
              <span>A</span>
            </div>
            <div class="separator-contacts"></div>
            `;
      currentLetter = firstletter(i);
    }
    contacts.innerHTML += `<div class="single-contact">
              <div class="cl-avatar">
                <div class="cl-overlay-text">AM</div>
              </div>
              <div class="single-contact-details">
                <span>Anton Müller</span>
                <a href="">antom@gmail.com</a>
              </div>
            </div>`;
  }
}

function firstletter(index) {} // Max

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
