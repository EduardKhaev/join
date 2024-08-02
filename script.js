const FIREBASE_URL =
  "https://join-e8e95-default-rtdb.europe-west1.firebasedatabase.app/";

let users = [];
let dataSet = [];

let activeUser = undefined;

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
  let contacts = document.getElementById("contact-list");
  contacts.innerHTML = "";
  let currentLetter = "";
  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    currentLetter = setFirstLetter(i, currentLetter, contacts);
    contacts.innerHTML += returnContactListItems(i, user);
  }
}

function setFirstLetter(i, currentLetter, contacts) {
  if (firstletter(i) != currentLetter) {
    contacts.innerHTML += `
          <div class="letter-alph">
            <span>${firstletter(i)}</span>
          </div>
          <div class="separator-contacts"></div>
          `;
    currentLetter = firstletter(i);
  }
  return currentLetter;
}

function firstletter(index) {
  let firstLetter = users[index].name.charAt(0);
  return firstLetter;
}

function showUserDetails(index, element) {
  setUserActive(element);
  let user = users[index];
  let fullContactDetails = document.getElementById("full-contact-details");
  fullContactDetails.innerHTML = returnUserDetails(user);
  fullContactDetails.classList.remove("contact-out");
}

function setUserActive(element) {
  if (activeUser) {
    activeUser.style.backgroundColor = "";
    activeUser.style.color = "";
    activeUser.classList.add("sc-color");
  }
  activeUser = element;
  activeUser.classList.remove("sc-color");
  activeUser.style.backgroundColor = "#2b3548";
  activeUser.style.color = "white";
}

function addNewUser() {
  let nameInput = document.getElementById("inputname").value;
  let mailInput = document.getElementById("inputemail").value;
  let phoneInput = document.getElementById("inputphone").value;
  let initials = getInitials(nameInput);
  mykey = "username";

  let newUser = {
    name: nameInput,
    email: mailInput,
    phone: phoneInput,
    color: "red",
    initials: initials,
  };
  postData("/names", newUser);
}

function getInitials(name) {
  let initials = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
  let firstLetter = initials.charAt(0);
  let lastLetter = initials.charAt(initials.length - 1);
  initials = firstLetter + lastLetter;
  return initials;
}

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
