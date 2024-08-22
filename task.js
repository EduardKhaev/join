/**
 * function to runb at page loading
 */
async function initTask() {
  await loadUsers();
  sortAllUsers();
  showLoggedInInitials();
  await insertContactsToInput();
  
  updateDate();
}

/**
 * creates a new task on submit
 * @param {event} event - click event
 * @param {string} taskState - state in which the task is created
 * @returns on failed validation false
 */
function createTask(event, taskState = "to do") {
  event.preventDefault();
  let validity = validateCategory();
  if (validity === false) return validity;
  let newTask = defaultTask;
  newTask = getAddTaskFormData(taskState);
  saveTask(newTask);
}

/**
 * clears the input fields and resets the form elements
 * @param {event} event - triggered event with the click
 */
function clearTaskForm(event) {
  event.preventDefault();
  document.getElementById("entertitle").value = "";
  document.getElementById("task-description").value = "";
  document.getElementById("due-date").value = "";
  document.getElementById("dropdown-title").innerText = "Select task category";
  document.getElementById("dropdown").dataset.selectedValue = "";
  document.getElementById("selected-contacts").innerHTML = "";
  clearSelectedContacts();
  document.getElementById("addedsubtasks").innerHTML = "";
  setUrgency(event, "medium");
}

function clearSelectedContacts() {
  let nodeList = document.getElementsByClassName("assigned-user");
  let checkboxList = Array.from(nodeList);
  checkboxList.forEach((element) => {
    element.checked = false;
  });
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
 * saves a task by sending it to the server and then redirects to the task board
 * @param {Object} task - the task object to be saved, containing details like title, description, etc.
 */
async function saveTask(task) {
  await postData("/tasks", task);
  showChangeSuccess("Task saved");
  setTimeout(() => {
    window.location.replace("./board.html");
  }, 2300);
}

/**
 * creates an task object from input values
 * @param {string} taskState
 * @returns the values from the input as an object
 */
function getAddTaskFormData(taskState) {
  let newTask = {
    title: getAddTaskInput("entertitle"),
    description: getAddTaskInput("task-description"),
    assigned: updateSelectedContacts(),
    date: getAddTaskInput("due-date"),
    priority: selectedUrgency,
    category: getCategoryFromDropdown(),
    subtasks: getSubtaskInputs(),
    taskState: taskState,
  };

  return newTask;
}

/**
 * Reads and returns the value of an input field
 * @param {string} id
 * @returns an input value or false
 */
function getAddTaskInput(id) {
  let input = document.getElementById(id).value;
  if (input) return input;
  else return "";
}

/**
 * gets the value of a dropdown menue
 * @returns the selected category or false
 */
function getCategoryFromDropdown() {
  let dropdown = document.getElementById("dropdown");
  let category = dropdown.dataset.selectedValue;
  if (category) return category;
  else return false;
}

/**
 * retrieves inputs for subtasks from the DOM and returns them as an array of objects
 * @returns
 */
function getSubtaskInputs() {
  let subtaskInputs = document.getElementsByClassName("subtask-value");
  let subtasks = [];
  for (let i = 0; i < subtaskInputs.length; i++) {
    const input = subtaskInputs[i];
    if (input.value.trim() !== "") {
      subtasks.push({ name: input.value.trim(), done: false });
    }
  }
  return subtasks;
}

/**
 * add a new subtask to a list
 * @param {event} event - triggered event from a button click
 */
let subtaskIndex = 0;
function addSubtask(event) {
  event.preventDefault();
  let subtaskField = document.getElementById("subtasks");
  let subtaskValue = subtaskField.value.trim();
  let addedSubtasks = document.getElementById("addedsubtasks");
  addedSubtasks.innerHTML += addSubtaskHTML(subtaskValue, subtaskIndex);
  subtaskField.value = "";
  subtaskIndex++;
}

/**
 * delete the subtask
 * @param {event} event - triggered event from a button click
 */
function deleteSubtask(index) {
  let subtaskItem = document.getElementById(`subtask-${index}`);
  if (subtaskItem) {
    subtaskItem.remove();
  }
}

/**
 * edit the subtask
 * @param {number} index - the id of the subtask to be edited
 */
function editSubtask(index) {
  let subtaskElement = document.getElementById(`subtask-${index}`);
  let initialIcons = subtaskElement.querySelector(".initial-icons");
  let addDeleteIcons = document.getElementById(`add-delete-icons-${index}`);
  let input = subtaskElement.querySelector(".subtask-input");
  subtaskElement.style.backgroundColor = "white";
  initialIcons.style.display = "none";
  addDeleteIcons.style.display = "flex";
  input.disabled = false;
  input.focus();
}

/**
 * save the edited subtask
 * @param {number} index - the id of the subtask to be saved
 */
function saveSubtask(index) {
  let subtaskElement = document.getElementById(`subtask-${index}`);
  let initialIcons = subtaskElement.querySelector(".initial-icons");
  let addDeleteIcons = subtaskElement.querySelector(".add-delete-icons");
  let input = subtaskElement.querySelector(".subtask-input");
  if (input.value.trim() === "") {
    deleteSubtask(index);
    return;
  }
  subtaskElement.style.backgroundColor = "";
  initialIcons.style.display = "flex";
  addDeleteIcons.style.display = "none";
  input.disabled = true;
}

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
  event.stopPropagation();
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
  return selectedContacts.length > 0 ? selectedContacts : false;
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

/**
 *  Closes the details dropdowns for contacts and categories if clicked outside of the elements.
 * @param {event} event - The click event triggered by mouse click.
 */
function closeDetails(event) {
  event.stopPropagation();
  if (event.target.tagName !== "SUMMARY") {
    let contactDetails = document.getElementById("assignedToContacts");
    let categoryDetails = document.getElementById("dropdown");
    let contactDetailsOverlay = document.getElementById(
      "assignedToContactsOverlay"
    );
    let contactDetailsEdit = document.getElementById("assignedToContactsEdit");

    if (contactDetails && contactDetails.hasAttribute("open")) {
      contactDetails.removeAttribute("open");
    }

    if (contactDetailsOverlay && contactDetailsOverlay.hasAttribute("open")) {
      contactDetailsOverlay.removeAttribute("open");
    }

    if (contactDetailsEdit && contactDetailsEdit.hasAttribute("open")) {
      contactDetailsEdit.removeAttribute("open");
    }

    if (categoryDetails && categoryDetails.hasAttribute("open")) {
      categoryDetails.removeAttribute("open");
    }
  }
}
