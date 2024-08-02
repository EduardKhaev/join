const FIREBASE_URL =
  "https://join-e8e95-default-rtdb.europe-west1.firebasedatabase.app/";

let users = [];

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
  
  // Clear previous content and prevent immediate visibility
  fullContactDetails.innerHTML = ''; 
  fullContactDetails.classList.add("contact-out"); // Use the class to prepare for the animation

  // Use a timeout to allow for the removal of the content then set new content
  setTimeout(() => {
    fullContactDetails.innerHTML = returnUserDetails(user);
    fullContactDetails.classList.remove("contact-out");
  }, 200); // Short delay to allow the "out" class to complete if needed
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
  activeUser.style.cursor = "pointer";
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

function addNewUser(event) {
  event.preventDefault();
  let newUser = getUserDataFromInput();
  postData("/names", newUser);
}

function getUserDataFromInput() {
  let nameInput = document.getElementById("inputname").value;
  let mailInput = document.getElementById("inputemail").value;
  let phoneInput = document.getElementById("inputphone").value;
  let initials = getInitials(nameInput);
  let newUser = {
    name: nameInput,
    email: mailInput,
    phone: phoneInput,
    color: "red",
    initials: initials,
  };
  return newUser;
}

function renderAddUserInputField() {
  createOverlay("adduser-overlay", "overlay");
  let overlayContent = document.getElementById("adduser-overlay");
  overlayContent.classList.add("contact-out");
  setTimeout(() => {
    overlayContent.innerHTML = getAddUserInputHtml();
    overlayContent.classList.remove("contact-out");
  }, 200); // Short delay to allow the "out" class to complete if needed
}

function renderEditUserInputField(index) {
  console.log(index);
}

function editUser(index, event) {
  event.preventDefault();
  let userId = users[index].id;
  let newUser = getUserDataFromInput();
  putData("/names/", userId, newUser);
}

function deleteUser(index) {
  let overlayContent = createOverlay("deleteUser-overlay", "overlay");
  overlayContent.innerHTML = renderConfirmationModal(index);
}

async function addUser() {
  let nameValue = document.getElementById("name").value;
  let phoneValue = document.getElementById("phone").value;
  let newUser = { name: nameValue, phone: phoneValue };
  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  await postData("/names", newUser);
  await loadUsers("/names");
}

async function putData(path = "/names/", id, data) {
  await fetch(FIREBASE_URL + path + id + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

async function postData(path = "/names", data) {
  await fetch(FIREBASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

async function deleteData(path = "/names/", id) {
  await fetch(FIREBASE_URL + path + id + ".json", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// let myOverlay = createOverlay("my-overlay-id", "classname");
// myOverlay.innerHTML =

function createOverlay(id, overlayclass = "overlay") {
  let parent = document.getElementById("body");
  let overlay = elementBuilder(parent, "div", overlayclass, id);
  return overlay;
}

function elementBuilder(parent, childType, childClass, childID = "") {
  let child = document.createElement(childType);
  child.className = childClass;
  child.id = childID;
  parent.appendChild(child);
  return child;
}
