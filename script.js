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

function showUserDetailsResponsive() {
  document.getElementById("add-btn-responsive").classList.add("add-btn-active");
}

function showUserDetailsSmall(index) {
  let user = users[index];
  let overlay = createOverlay("overlay-small", "overlay-small");
  overlay.innerHTML = returnUserDetailsSmall(index, user);
  overlay.style.left = "100%";
  overlay.style.left = "0";
  let parent = document.getElementById("navigation-items");
  parent.innerHTML += `
  <div class="edit-btn-responsive" id="edit-btn-responsive" onclick="renderEditUserChoice(${index})">
    <img src="./img/edit-responsive.png" alt="" />
  </div>`;
}

function renderEditUserChoice(index, user) {
  // let overlayContent = createOverlay("choice-overlay", "choice-overlay");
  let content = document.getElementById("navigation-items");
  content.innerHTML += `
  <div class="choice-container">
            <div class="ci-actions-item-responsive" onclick="renderEditUserInputField(${index})">
              <svg fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 17H3.4L12.025 8.375L10.625 6.975L2 15.6V17ZM16.3 6.925L12.05 2.725L13.45 1.325C13.8333 0.941667 14.3042 0.75 14.8625 0.75C15.4208 0.75 15.8917 0.941667 16.275 1.325L17.675 2.725C18.0583 3.10833 18.2583 3.57083 18.275 4.1125C18.2917 4.65417 18.1083 5.11667 17.725 5.5L16.3 6.925ZM14.85 8.4L4.25 19H0V14.75L10.6 4.15L14.85 8.4Z" fill="#2A3647"/>
              </svg>
              <div>Edit</div>
            </div>
            <div class="ci-actions-item-responsive" onclick="deleteUser('${users[index].id}')">
              <svg fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z" fill="#2A3647"/>
              </svg>
              <div>Delete</div>
            </div>
  </div>`;
}

function closeUserDetails() {
  let overlay = document.getElementById("overlay-small");
  let editBtn = document.getElementById("edit-btn-responsive");
  overlay.style.left = "100%";
  setTimeout(() => {
    overlay.remove();
    editBtn.remove();
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

function clearActiveUser() {
  if (activeUser) {
    activeUser.style.backgroundColor = "";
    activeUser.style.color = "";
    activeUser.classList.add("sc-color");
  }
  activeUser = undefined;
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

async function addNewUser(event) {
  event.preventDefault();
  let newUser = getUserDataFromInput();
  await postData("/names", newUser);
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

function showInvalid(element) {
  element.style.borderColor = "red";
}

function removeInvalid(element) {
  element.style = "";
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
  overlayContent.classList.remove("adduser-maincontainer");
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
  removeUserDetails();
}

function removeUserDetails() {
  let overlay = document.getElementById("overlay-small");
  if (overlay) {
    overlay.remove();
  } else {
    document.getElementById("full-contact-details").innerHTML = "";
  }
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

function toggleDropdown(event) {
  event.stopPropagation();
  const dropdownMenu = document.getElementById("dropdownMenu");
  if (dropdownMenu.style.display === "block") {
    dropdownMenu.style.display = "none";
  } else {
    dropdownMenu.style.display = "block";
  }
}

window.onclick = function (event) {
  const dropdownMenu = document.getElementById("dropdownMenu");
  if (
    event.target !== dropdownMenu &&
    event.target !== document.getElementById("user-profile-initials")
  ) {
    dropdownMenu.style.display = "none";
  }
};
