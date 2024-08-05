const FIREBASE_URL =
  "https://join-e8e95-default-rtdb.europe-west1.firebasedatabase.app/";

let users = [];

let activeUser = undefined;

let activeNavItem = undefined;

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
  if (window.innerWidth > 745) {
    showUserDetailsBig(index);
  } else {
    showUserDetailsSmall(index);
  }
}

function showUserDetailsBig(index) {
  let user = users[index];
  let fullContactDetails = document.getElementById("full-contact-details");
  fullContactDetails.innerHTML = "";
  fullContactDetails.classList.remove("d-none");
  fullContactDetails.classList.add("contact-out");
  setTimeout(() => {
    fullContactDetails.innerHTML = returnUserDetails(index, user);
    fullContactDetails.classList.remove("contact-out");
  }, 200);
}

function showUserDetailsSmall(index) {
  let user = users[index];
  let overlay = createOverlay("overlay-small", "overlay-small");
  overlay.innerHTML = returnUserDetailsSmall(index, user);
  overlay.style.left = "0";
}

function closeUserDetails() {
  let overlay = document.getElementById("overlay-small");
  overlay.style.left = "100%";
  setTimeout(() => {
    overlay.remove();
  }, 200);
  clearActiveUser();
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

function clearActiveUser() {}

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
  cancelAddUser();
  users = [];
  init();
  showChangeSuccess("Contact successfully added");
}

function getUserDataFromInput() {
  let nameInput = document.getElementById("inputname").value;
  let mailInput = document.getElementById("inputemail").value;
  let phoneInput = document.getElementById("inputphone").value;
  let initials = getInitials(nameInput);
  let color = getRandomColor();
  let newUser = {
    name: nameInput,
    email: mailInput,
    phone: phoneInput,
    color: color,
    initials: initials,
  };
  return newUser;
}

function renderAddUserInputField() {
  let overlayContent = createOverlay("adduser-overlay", "overlay");
  setTimeout(() => {
    overlayContent.innerHTML = getAddUserInputHtml();
    overlayContent = document.getElementById("adduser-maincontainer");
    overlayContent.classList.remove("contact-out");
  }, 200);
}

function cancelAddUser() {
  let overlayContent = document.getElementById("adduser-maincontainer");
  overlayContent.classList.add("adduser-maincontainer-out");
  overlayContent.classList.remove("contact-out");
  setTimeout(() => {
    document.getElementById("adduser-overlay").remove();
  }, 200);
}

function renderEditUserInputField(index) {
  let overlayContent = createOverlay("adduser-overlay", "overlay");
  let user = users[index];
  setTimeout(() => {
    overlayContent.innerHTML = getUserEditHtml(user);
    overlayContent = document.getElementById("adduser-maincontainer");
  }, 200);
}

async function addEditedUser(event, userId, saveData) {
  event.preventDefault();
  let newUser = getUserDataFromInput();
  cancelAddUser();
  if (saveData) {
    await performEdit(userId, newUser);
  } else {
    await performDelete(userId);
  }
}

async function performEdit(userId, newUser) {
  await putData("/names/", userId, newUser);
  users = [];
  init();
  showChangeSuccess("Contact successfully edited");
}

async function performDelete(userId) {
  await deleteData("/names/", userId);
  users = [];
  init();
  showChangeSuccess("Contact deleted");
}

function deleteUser(userId) {
  let overlayContent = createOverlay("adduser-overlay", "overlay");
  overlayContent.innerHTML = renderConfirmationModal(userId);
}

function confirmDelete(userId) {
  cancelDelete();
  performDelete(userId);
}

function cancelDelete() {
  let overlayContent = document.getElementById("confirmation-modal");
  overlayContent.classList.add("confirmation-modal-out");
  setTimeout(() => {
    document.getElementById("adduser-overlay").remove();
  }, 200);
}

function showChangeSuccess(message) {
  let parent = document.getElementById("body");
  let messagePopUp = elementBuilder(parent, "div", "display-message");
  messagePopUp.innerHTML = message;
  messagePopUp.style.opacity = "0";
  messagePopUp.style.opacity = "1";
  setTimeout(() => {
    messagePopUp.style.opacity = "0";
  }, 2000);
  setTimeout(() => {
    messagePopUp.remove();
  }, 2300);
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

function getRandomColor() {
  let color = "";
  let hue = getRandomInt(255);
  let saturation = getRandomInt(30) + 70;
  color = hslToHex(hue, saturation, 50);
  console.log(color);
  return color;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function setNavActive(element) {
  if (activeNavItem) {
    activeNavItem.classList.remove("active");
  }
  activeNavItem = element;
  activeNavItem.classList.add("active");
}

function setSummaryActive(element) {
  setNavActive(element);
}

function setAddTaskActive(element) {
  setNavActive(element);
}

function setBoardActive(element) {
  setNavActive(element);
}

function setContactsActive(element) {
  setNavActive(element);
}
