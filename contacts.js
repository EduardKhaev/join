const FIREBASE_URL =
  "https://join-e8e95-default-rtdb.europe-west1.firebasedatabase.app/";

let users = [];

let activeUser = undefined;

let activeNavItem = undefined;

/**
 * initializes basic functions on contacts page
 */
async function initContacts() {
  await loadUsers();
  sortAllUsers();
  displayUsers();
}

/**
 * load users data from firebase
 * @param {string} path - defines path to data on db
 */
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

/**
 * sorts users alphabetically
 */
function sortAllUsers() {
  users.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * displays users in contact list element
 */
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

/**
 * Sets first letter of each section in contacts list
 * @param {int} i - index of loop in displayUsers()
 * @param {String} currentLetter - Letter of Section-Header in List
 * @param {HTMLElement} contacts - contact-list HTML Element
 * @returns - current letter if changed
 */
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

/**
 * helper function to get first letter of a contacts name
 * @param {int} index
 * @returns - the first letter
 */
function firstletter(index) {
  let firstLetter = users[index].name.charAt(0);
  return firstLetter;
}

/**
 * evoked by click on contact in contact list to show the detailed user info
 * highlights clicked on entry
 * @param {int} index - index in users array
 * @param {HTMLElement} element - element that was clicked on
 */
function showUserDetails(index, element) {
  setUserActive(element);
  if (window.innerWidth > 745) {
    showUserDetailsBig(index);
  } else {
    showUserDetailsSmall(index);
  }
}

/**
 * shows user information on screens > 745px
 * @param {int} index - index in users array
 */
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

/**
 * shows user information on screens < 745px
 * @param {int} index - index in users array
 */
function showUserDetailsSmall(index) {
  let user = users[index];
  let overlay = createOverlay("overlay-small", "overlay-small");
  overlay.innerHTML = returnUserDetailsSmall(index, user);
  overlay.style.left = "100%";
  overlay.style.left = "0";
  let parent = document.getElementById("navigation-items");
  parent.innerHTML += `
  <div class="edit-btn-responsive" id="edit-btn-responsive" onclick="renderEditUserChoice(event, ${index})">
    <img src="./img/edit-responsive.png" alt="" />
  </div>`;
}

/**
 * shows selection element after button is clicked
 * @param {event} event - click event
 * @param {int} index - index of user (users array) in detail view
 */
function renderEditUserChoice(event, index) {
  event.stopPropagation();
  let content = document.getElementById("navigation-items");
  content.innerHTML += returnEditUserChoice(index);
}

/**
 * close user details
 */
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

/**
 * Highlights the selected contact list entry
 * @param {HTMLElement} element
 */
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

/**
 * unhighlightes the previously selected user
 */
function clearActiveUser() {
  if (activeUser) {
    activeUser.style.backgroundColor = "";
    activeUser.style.color = "";
    activeUser.classList.add("sc-color");
  }
  activeUser = undefined;
}

/**
 * Gets the initials of a newly created contact
 * @param {String} name - name of the contact
 * @returns - initials of the contact
 */
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

/**
 * creates a new contact after input, gets values and stores in firebase
 * @param {event} event - click event
 */
async function addNewUser(event) {
  event.preventDefault();
  let newUser = getUserDataFromInput(true);
  await postData("/names", newUser);
  cancelAddUser();
  users = [];
  initContacts();
  showChangeSuccess("Contact successfully added");
}

/**
 *
 * reads input values from form
 * @param {boolean} newInput - new contact (true) or edited contact (false)
 * @param {int} index - index in users array
 * @returns object from input data
 */
function getUserDataFromInput(newInput, index) {
  let nameInput = document.getElementById("inputname").value;
  let mailInput = document.getElementById("inputemail").value;
  let phoneInput = document.getElementById("inputphone").value;
  let initials = getInitials(nameInput);
  let color = "";
  if (newInput === true) {
    color = getRandomColor();
  } else {
    color = users[index].color;
  }
  let newUser = {
    name: nameInput,
    email: mailInput,
    phone: phoneInput,
    color: color,
    initials: initials,
  };
  return newUser;
}

/**
 * invoked after invalid user input
 * @param {HTMLElement} element - validated input element
 */
function showInvalid(element) {
  element.style.borderColor = "red";
}

/**
 * removes styling if invalid element gets focus
 * @param {HTMLElement} element - focussed on element
 */
function removeInvalid(element) {
  element.style = "";
}

/**
 * created a user input field to create a new contact
 */
function renderAddUserInputField() {
  let overlayContent = createOverlay("adduser-overlay", "overlay");
  document.getElementById("add-btn-responsive").style.backgroundColor = "var(--brand-blue)";
  setTimeout(() => {
    overlayContent.innerHTML = getAddUserInputHtml();
    overlayContent = document.getElementById("adduser-maincontainer");
    overlayContent.classList.remove("contact-out");
  }, 200);
}

/**
 * closes the create/edit user modal without applying input data
 */
function cancelAddUser() {
  document.getElementById("add-btn-responsive").style.backgroundColor = "var(--brand-dark)";
  let overlayContent = document.getElementById("adduser-maincontainer");
  overlayContent.classList.add("adduser-maincontainer-out");
  overlayContent.classList.remove("adduser-maincontainer");
  setTimeout(() => {
    document.getElementById("adduser-overlay").remove();
  }, 200);
}

/**
 * opens an input modal to edit existing user data
 * @param {int} index - index in users array
 */
function renderEditUserInputField(index) {
  let overlayContent = createOverlay("adduser-overlay", "overlay");
  let user = users[index];
  setTimeout(() => {
    overlayContent.innerHTML = getUserEditHtml(user);
    overlayContent = document.getElementById("adduser-maincontainer");
  }, 200);
}

/**
 * add data of edited user to firebase or delete user data
 * @param {event} event - click event
 * @param {string} userId - firebase id
 * @param {boolean} saveData - true for save / false for delete
 */
async function addEditedUser(event, userId, saveData) {
  event.preventDefault();
  let index = getUserIndex(userId);
  let newUser = getUserDataFromInput(false, index);
  cancelAddUser();
  if (saveData) {
    await performEdit(userId, newUser);
  } else {
    await performDelete(userId);
  }
}

/**
 * saves changes to firebase
 * @param {string} userId - firebase id
 * @param {object} newUser - new object to push
 */
async function performEdit(userId, newUser) {
  await putData("/names/", userId, newUser);
  users = [];
  await initContacts();
  let index = getUserIndex(userId);
  showUserDetails(index, activeUser);
  showChangeSuccess("Contact successfully edited");
}

/**
 * gets user index in users array that matches firebase ID
 * @param {string} userId - firebase ID
 * @returns the index
 */
function getUserIndex(userId) {
  let index = users.findIndex((user) => user["id"] == userId);
  return index;
}

/**
 * deletes entry in firebase
 * @param {string} userId - firebase id
 */
async function performDelete(userId) {
  await deleteData("/names/", userId);
  users = [];
  await initContacts();
  showChangeSuccess("Contact deleted");
}

/**
 * opens confirmation modal
 * @param {string} userId - firebase id
 */
function deleteUser(userId) {
  let overlayContent = createOverlay("adduser-overlay", "overlay");
  overlayContent.innerHTML = renderConfirmationModal(userId);
}

/**
 *
 * @param {string} userId - firebase id
 */
function confirmDelete(userId) {
  cancelDelete();
  performDelete(userId);
  removeUserDetails();
}

/**
 * removes the user details view
 */
function removeUserDetails() {
  let overlay = document.getElementById("overlay-small");
  if (overlay) {
    overlay.remove();
  } else {
    document.getElementById("full-contact-details").innerHTML = "";
  }
}

/**
 * cancels the delete of an contact and closes the modal
 */
function cancelDelete() {
  let overlayContent = document.getElementById("confirmation-modal");
  overlayContent.classList.add("confirmation-modal-out");
  setTimeout(() => {
    document.getElementById("adduser-overlay").remove();
  }, 200);
}

/**
 * toggle dropdown menue in header
 * @param {event} event - click event
 */
function toggleDropdown(event) {
  event.stopPropagation();
  const dropdownMenu = document.getElementById("dropdownMenu");
  if (dropdownMenu.style.display === "block") {
    dropdownMenu.style.display = "none";
  } else {
    dropdownMenu.style.display = "block";
  }
}

/**
 * eventlistener for clicks outside of opened menues to close them
 * @param {event} event - click event
 */
window.onclick = function (event) {
  const dropdownMenu = document.getElementById("dropdownMenu");
  const editChoice = document.getElementById("choice-container");
  let button = document.getElementById("edit-btn-responsive");
  if (
    event.target !== dropdownMenu &&
    event.target !== document.getElementById("user-profile-initials")
  ) {
    dropdownMenu.style.display = "none";
  }
  if (
    editChoice &&
    event.target !== editChoice &&
    !editChoice.contains(event.target) &&
    event.target !== button
  ) {
    editChoice.remove();
  }
};
