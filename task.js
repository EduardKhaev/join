let newTask = {
  id: "8549058390jk",
  title: "Meine Aufgabe",
  description: "Räum dein Zimmer auf",
  assigned: ["id of user - you", "id1fghzusdu4342", "589834359023"],
  date: "2024-08-22",
  priority: "urgent",
  category: "string",
  subtasks: [
    { name: "string", done: false },
    { name: "string", done: false },
  ],
  taskState: "to do",
};

let selectedUrgency = "medium";
// set urgency medium at start?

/**
 * function to runb at page loading
 */
async function initTask() {
  await loadUsers();
  sortAllUsers();
  await insertContactsToInput();
  updateDate();
}

function createTask(event, taskState = "to do") {
  event.preventDefault();
  let validity = validateCategory();
  if (validity === false) return validity;
  console.log("create task button presses");
}

function clearTaskForm(event) {
  event.preventDefault();
  console.log("clear form pressed");
}

/**
 * clear the subtask input field
 * @param {event} event - triggered event from a button click
 */
function clearSubtask(event) {
  event.preventDefault();
  let subtaskField = document.getElementById("subtasks");
  subtaskField.value = "";
}

/**
 *
 * @param {event} event - triggered event from a button click
 */
function addSubtask(event) {
  event.preventDefault();
  let subtaskField = document.getElementById("subtasks");
  let subtaskValue = subtaskField.value.trim();
  let addedSubtasks = document.getElementById("addedsubtasks");
  addedSubtasks.innerHTML += addSubtaskHTML(subtaskValue);
  subtaskField.value = "";
}

/**
 *
 * @param {event} event - triggered event from a button click
 */
function deleteSubtask(event) {
  event.preventDefault();
  let subtaskItem = event.target.closest("li");
  if (subtaskItem) {
    subtaskItem.remove();
  }
}

let isEditing = false;

function editSubtask(event) {
  event.preventDefault();
  let subtaskItem = event.target.closest('li');
  if (subtaskItem) {
    let subtaskInput = subtaskItem.querySelector('.subtask-input');

    if (isEditing) {
      subtaskInput.disabled = true;
      isEditing = false;
    } else {
      subtaskInput.disabled = false;
      subtaskInput.focus();
      isEditing = true;
    }
  }}

function searchContacts(searchterm) {}

/**
 * adding contacts to select element in input form
 */
async function insertContactsToInput() {
  let list = document.getElementById("contactDropDown");
  list.innerHTML = "";
  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    list.innerHTML += renderContactDropdown(user);
  }
}

/**
 * set date of today to date selector
 */
function updateDate() {
  let today = getTodaysDate();
  document.getElementById("due-date").min = today;
}

/**
 * Determines which priority button was pressed and changes styles
 * @param {event} event - click event
 * @param {string} urgency - selected prio level
 */
function setUrgency(event, urgency) {
  event.preventDefault();
  event.stopPropagation();
  if (selectedUrgency) clearUrgencyButton(selectedUrgency);
  selectedUrgency = urgency;
  setActiveUrgencyButton(selectedUrgency);
}

/**
 * Removes active styling from prio button
 * @param {string} oldUrgency - priviously selected prio level
 */
function clearUrgencyButton(oldUrgency) {
  let button = document.getElementById(`${oldUrgency}-button`);
  button.classList.remove(`${oldUrgency}-active`);
}

/**
 * Adds styling to selected prio button
 * @param {string} selectedUrgency - selected prio level
 */
function setActiveUrgencyButton(selectedUrgency) {
  let button = document.getElementById(`${selectedUrgency}-button`);
  button.classList.add(`${selectedUrgency}-active`);
}

/**
 * Toggles Checkbox when parent element is clicked
 * @param {string} id - id of input checkbox
 */
function markContactAssigned(id) {
  let checkbox = document.getElementById(id);
  checkbox.checked = !checkbox.checked;
  updateSelectedContacts();
}

/**
 * extracts the selected items from "Assigned to"-Dropdown
 * @returns an array of userIds {string}
 */
function updateSelectedContacts() {
  let nodeList = document.getElementsByClassName("assigned-user");
  let checkboxList = Array.from(nodeList);
  let selectedContacts = [];
  checkboxList.forEach((element) => {
    if (element.checked) selectedContacts.push(element.id);
  });
  displaySelectedContacts(selectedContacts);
  return selectedContacts;
}

/**
 * Displays the user avatars of users assigned to a task
 * @param {Array} contacts - array of userIds
 */
function displaySelectedContacts(contacts) {
  let container = document.getElementById("selected-contacts");
  container.innerHTML = "";
  for (let i = 0; i < contacts.length; i++) {
    let index = getUserIndex(contacts[i]);
    let user = users[index];
    container.innerHTML += `
      <div class="task-avatar" style = "background-color: ${user.color};">${user.initials}</div>
      `;
  }
}

/**
 * Selecting and storing an item from a dropdown
 * @param {HTMLElement} element - HTMLElement that was clicked on
 */
function selectCategory(element) {
  let value = element.getAttribute("data-value");
  let text = element.querySelector(".assigned-person").textContent;
  document.getElementById("dropdown-title").textContent = text;
  let dropdown = document.getElementById("dropdown");
  dropdown.dataset.selectedValue = value;
  removeInvalid(dropdown);
  dropdown.removeAttribute("open");
}

/**
 * Checks if a category has been selected
 * @returns validation success
 */
function validateCategory() {
  let dropdown = document.getElementById("dropdown");
  let selectedValue = dropdown.dataset.selectedValue;
  if (!selectedValue) {
    showInvalid(dropdown);
    return false;
  }
  return true;
}
