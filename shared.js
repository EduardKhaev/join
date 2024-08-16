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
    dropdownMenu &&
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
