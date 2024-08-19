/**
 * initializes the task board by loading necessary data and rendering tasks
 */
async function initBoard() {
  await loadUsers();
  sortAllUsers();
  await loadTasks();
  await groupTasks();
  await tasksByDate();
  renderTasks();
}

/**
 * loads tasks from firebase
 * @param {string} path - the path from which to load the tasks
 */
async function loadTasks(path = "/tasks") {
  let taskResponse = await fetch(FIREBASE_URL + path + ".json");
  let responseToJson = await taskResponse.json();
  if (responseToJson) {
    Object.keys(responseToJson).forEach((key) => {
      tasks.push({
        id: key,
        title: responseToJson[key]["title"],
        description: responseToJson[key]["description"],
        assigned: responseToJson[key]["assigned"],
        date: responseToJson[key]["date"],
        priority: responseToJson[key]["priority"],
        category: responseToJson[key]["category"],
        subtasks: responseToJson[key]["subtasks"],
        taskState: responseToJson[key]["taskState"],
      });
    });
  }
}

/**
 * Renders all tasks across different areas.
 * Calls the `renderTasksInArea` function for each area of tasks with appropriate empty messages.
 */
function renderTasks() {
  let toDos = groupedTasks["to do"];
  let inProgressTasks = groupedTasks["in progress"];
  let awaitFeedbackTasks = groupedTasks["await feedback"];
  let doneTasks = groupedTasks["done"];

  renderTasksInArea(toDos, "to-do", "No tasks to do");
  renderTasksInArea(inProgressTasks, "in-progress", "No tasks in progress");
  renderTasksInArea(
    awaitFeedbackTasks,
    "await-feedback",
    "No tasks awaiting feedback"
  );
  renderTasksInArea(doneTasks, "done", "No tasks done");
}

/**
 * Renders tasks in a specific area column.
 *
 * @param {Array} tasksInArea - The array of tasks to be rendered in the specific area.
 * @param {string} areaId - The ID of the target column where the tasks should be rendered.
 * @param {string} emptyMessage - The message to display when there are no tasks in this area.
 */
function renderTasksInArea(tasksInArea, areaId, emptyMessage) {
  let taskColumn = document.getElementById(areaId);
  taskColumn.innerHTML = "";
  if (!Array.isArray(tasksInArea) || tasksInArea.length === 0) {
    taskColumn.innerHTML = `
    <div class="empty-column"><span>${emptyMessage}</span></div>
    `;
  } else {
    for (let i = 0; i < tasksInArea.length; i++) {
      let task = tasksInArea[i];
      let taskId = task.id;
      let categoryColor = getCategoryColor(task);
      let description = shortenDescription(task.description);
      let subtasksNumber = countSubtaskNumber(task.subtasks);
      let completedSubtasks = countCompletedSubtasks(task.subtasks);
      let percentage = calculateCompletionPercentage(
        completedSubtasks,
        subtasksNumber
      );
      taskColumn.innerHTML += createTaskHTML(
        task,
        taskId,
        categoryColor,
        description,
        percentage,
        completedSubtasks,
        subtasksNumber
      );
      updatePriority(task.priority, taskId);
      updateAvatars(task.assigned, taskId);
    }
  }
}

/**
 * Updates the priority marker for a task.
 *
 * @param {string} priority - The priority of the task.
 * @param {string} taskId - The ID of the task.
 */
function updatePriority(priority, taskId) {
  let urgency = document.getElementById(`ts-priority${taskId}`);
  let priorityMarker = getPriorityMarker(priority);
  urgency.innerHTML = `${priorityMarker}`;
}

/**
 * Updates the avatars for a task.
 *
 * @param {Array} assigned - The list of assigned user IDs.
 * @param {string} taskId - The ID of the task.
 */
function updateAvatars(assigned, taskId) {
  let avatars = document.getElementById(`ts-avatars${taskId}`);
  if (Array.isArray(assigned) && assigned.length > 0) {
    for (let j = 0; j < Math.min(assigned.length, 5); j++) {
      let userId = assigned[j];
      let user = users[getUserIndex(userId)];
      let marginLeft = j > 0 ? "-9px" : "0px";

      avatars.innerHTML += `
        <div class="ts-avatar" style="background-color: ${
          user.color
        }; z-index: ${j + 2}; margin-left: ${marginLeft};">${
        user.initials
      }</div>
      `;
    }
    if (assigned.length > 5) {
      avatars.innerHTML += `
        <div class="ts-avatar" style="background-color: #ccc; z-index: 7; margin-left: -9px;">
          +${assigned.length - 5}
        </div>
      `;
    }
  }
}

/**
 * displays the details of a task
 * @param {id} id - the unique identifier of the task to be displayed
 */
function showTaskDetails(id) {
  let task = getTaskById(id);
  let date = formatDate(task.date);
  let priorityMarker = getPriorityMarker(task.priority);
  let overlay = createOverlay("task-details-overlay");
  let categoryColor = getCategoryColor(task);
  overlay.innerHTML = getTaskLargeContentHtml(
    task,
    date,
    priorityMarker,
    categoryColor
  );
  showDetailsAssigned(task.assigned);
  showDetailsSubtask(task.subtasks, task.id);
  let taskDetails = document.getElementById("task-large");
  taskDetails.classList.add("slide-in");
}

/**
 * closes the task details overlay
 */
function closeTaskDetails(
  overlayId = "task-details-overlay",
  containerId = "task-large"
) {
  let taskDetails = document.getElementById(containerId);
  taskDetails.classList.add("slide-out");
  setTimeout(() => {
    let overlay = document.getElementById(overlayId);
    if (overlay) {
      overlay.remove();
    }
    updateTasks();
    taskDetails.classList.remove("slide-out");
  }, 180);
}

/**
 * displays the details of the users assigned to a task
 * @param {Array} assigned  - an array of user IDs assigned to the task
 */
function showDetailsAssigned(assigned) {
  let assignments = document.getElementById("tl-persons");
  if (assigned === undefined || assigned === false) {
    document.getElementById("tl-assignment").remove();
  } else {
    for (let i = 0; i < assigned.length; i++) {
      let userId = assigned[i];
      let index = getUserIndex(userId);
      let user = users[index];
      assignments.innerHTML += getAssignmentsHtml(user);
    }
  }
}

/**
 * displays the details of the subtasks associated with a task
 * @param {array} subtasks - an array of subtasks related to the main task or false/undefined if there are none
 * @param {string|number} taskId - the unique identifier of the task to which the subtasks belong
 */
function showDetailsSubtask(subtasks, taskId) {
  let subtaskContent = document.getElementById("tl-sub-checks");
  if (subtasks === false || subtasks === undefined) {
    document.getElementById("tl-subtasks").remove();
  } else {
    for (let i = 0; i < subtasks.length; i++) {
      let subtask = subtasks[i];
      subtaskContent.innerHTML += getSubtaskContentHtml(subtask, i, taskId);
      setTimeout(() => {
        document.getElementById(`checkbox${i}`).checked = subtask.done;
      }, 100);
    }
  }
}

/**
 * updates the completion status of a subtask based on user interaction
 * @param {number} index - the index of the subtask within the subtasks array
 * @param {string|number} taskId - the unique identifier of the task to which the subtask belongs
 */
async function updateSubtaskFromDetails(index, taskId) {
  let checked = document.getElementById(`checkbox${index}`).checked;
  let task = getTaskById(taskId);
  if (task) {
    task.subtasks[index].done = checked;
    await putData("/tasks/", taskId, task);
  }
}

/**
 *  return a task from the tasks array based on its unique identifier
 * @param {string|number} id - the unique identifier of the task to be returned
 * @returns
 */
function getTaskById(id) {
  let index = tasks.findIndex((task) => task["id"] == id);
  let task = tasks[index];
  return task;
}

/**
 *  opens an overlay for editing the details of a task
 * @param {string|number} id - the unique identifier of the task to be edited
 */
function editTask(id) {
  let task = getTaskById(id);
  selectedUrgency = task.priority;
  let overlay = createOverlay("edit-task-overlay");
  overlay.innerHTML = getEditTaskContentHtml(task);
  updateDate();
  insertContactsToInput();
  applySelectedContacts(task);
  showEditSubtasks(task.subtasks, task.id);
  let oldOverlay = document.getElementById("task-details-overlay");
  oldOverlay.remove();
}

function applySelectedContacts(task) {
  for (let i = 0; i < task.assigned.length; i++) {
    markContactAssigned(task.assigned[i]);
  }
}

/**
 * saves the edited details of a task and updates the task data
 * @param {event} event - the event object associated with the form submission
 * @param {string|number} taskId - the unique identifier of the task being edited
 * @param {object} taskState - the current state of the task to be preserved during the update
 */
async function saveEditedTask(event, taskId, taskState) {
  let urgencyForSave = selectedUrgency;
  event.preventDefault();
  let task = getTaskById(taskId);
  let newTask = {
    title: getAddTaskInput("entertitle"),
    description: getAddTaskInput("task-description"),
    assigned: updateSelectedContacts(),
    date: getAddTaskInput("due-date"),
    category: task.category,
    priority: urgencyForSave,
    subtasks: getEditedSubtasks(),
    taskState: taskState,
  };
  await putData("/tasks/", taskId, newTask);
  showChangeSuccess("Changes saved");
  updateTasks();
  closeEditTask("edit-task-overlay");
}

/**
 * resets the tasks and users arrays and load the task board
 */
function updateTasks() {
  tasks = [];
  users = [];
  initBoard();
}

/**
 * closes the edit task overlay and removes it from the DOM
 * @param {string} overlay - the ID of the overlay to be closed
 */
function closeEditTask() {
  let editedTaskDetails = document.getElementById("task-large-edit");
  editedTaskDetails.classList.add("slide-out");
  setTimeout(() => {
    let overlay = document.getElementById("edit-task-overlay");
    if (overlay) {
      overlay.remove();
    }
    updateTasks();
    editedTaskDetails.classList.remove("slide-out");
  }, 180);
}

/**
 * deletes a task from the database
 * @param {string|number} taskId - the unique identifier of the task to be deleted
 */
async function deleteTask(taskId) {
  await deleteData("/tasks/", taskId);
  tasks = [];
  closeTaskDetails((overlay = "task-details-overlay"));
  updateTasks();
}

/**
 * displays the subtasks associated with a specific task for editing
 * @param {array} subtasks - an array of subtasks
 * @param {string|number} taskId - the unique identifier of the task to which the subtasks belong
 */
function showEditSubtasks(subtasks, taskId) {
  let subtaskContent = document.getElementById("addedsubtasks");
  if (subtasks) {
    for (let i = 0; i < subtasks.length; i++) {
      let subtask = subtasks[i];
      subtaskContent.innerHTML += addSubtaskHTML(subtask.name, i);
      document.getElementById(`subtask-${i}`).value = subtask.done;
    }
  }
}

/**
 * returns the edited subtasks from the user interface
 * @returns an array of subtask objects, each containing a name and completion status
 */
function getEditedSubtasks() {
  let nodelist = document.getElementsByClassName("subtask-list-element");
  let tasknames = document.getElementsByClassName("subtask-value");
  let taskstates = document.getElementsByClassName("subtask-list-element");
  let subtasks = [];
  for (let i = 0; i < nodelist.length; i++) {
    let subtaskName = tasknames[i].value;
    let subtaskDone = taskstates[i].value;
    let subtask = { name: subtaskName, done: Boolean(subtaskDone) };
    subtasks.push(subtask);
  }
  return subtasks;
}

/**
 * initializes and displays an overlay for adding a new task
 * @param {string} status - the status of the new task being added
 */

function addTaskBoard(status) {
  let overlay = createOverlay("add-task-board");
  overlay.innerHTML = addTaskBoardHTML(status);
  let addTask = document.getElementById("addtask-overlaycontainer");
  addTask.classList.add("slide-in");
  insertContactsToInput();
  updateDate();
}

/**
 * Retrieves a color based on the category of a task item.
 *
 * @param {Object} task - The task item object.
 * @param {string} task.category - The category of the task item.
 * @returns {string} - The color associated with the category.
 */
function getCategoryColor(task) {
  if (task.category == "Technical Task") {
    color = "#1FD7C1";
  } else {
    color = "#0038FF";
  }
  return color;
}

/**
 * Shortens a description to a maximum of 6 words and adds "..." if more words are present.
 *
 * @param {string} description - The description text to be shortened.
 * @returns {string} - The shortened description if more than 6 words are present; otherwise, the original description.
 */
function shortenDescription(description) {
  if (typeof description !== "string") {
    description = "";
  }
  let words = description.split(" ");
  if (words.length > 6) {
    return words.slice(0, 6).join(" ") + "...";
  }
  return description;
}
