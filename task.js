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

let selectedUrgency = "";
// set urgency medium at start?

/**
 * function to runb at page loading
 */
async function initTask() {
  await loadUsers();
  await sortAllUsers();
  await insertContactsToInput();
  await updateDate();
}

function createTask(event, taskState = "to do") {
  event.preventDefault();
  console.log("create task button presses");
}

function clearTaskForm(event) {
  event.preventDefault();
}

function clearSubtask(event, subtaskIndex) {
  event.preventDefault();
  let subtaskField = document.getElementById("subtasks");
  subtaskField.value = "";
}

function addSubtask(event, subtaskIndex) {
  event.preventDefault();
  let subtaskField = document.getElementById("subtasks");
  let subtaskValue = subtaskField.value.trim();
  newTask.subtasks.push(subtaskValue);
}

function deleteSubtask(event, subtaskIndex) {
  event.preventDefault();
}

function editSubtask(event) {
  event.preventDefault();
}

function updateSubtask(event, subtaskIndex) {
  event.preventDefault();
}

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
function updateDate() {}

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

function updateSelectedContacts() {
  let nodeList = document.getElementsByClassName("assigned-user");
  let checkboxList = Array.from(nodeList);
  let selectedContacts = [];
  checkboxList.forEach((element) => {
    if (element.checked) selectedContacts.push(element.id);
  });
  displaySelectedContacts(selectedContacts);
}

function displaySelectedContacts(contacts) {
  for (let i = 0; i < contacts.length; i++) {
    let index = getUserIndex(contacts[i]);
    console.log(users[index].initials, users[index].color);
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
  dropdown.removeAttribute("open");
}
