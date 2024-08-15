let tasks = [];
let groupedTasks = {};
let currentDraggedTask;

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
 * groups the tasks by their task state and stores the result in the `groupedTasks` variable
 */
async function groupTasks() {
  if (tasks) groupedTasks = Object.groupBy(tasks, ({ taskState }) => taskState);
}

/**
 * sorts the tasks within each group by their date property
 */
async function tasksByDate() {
  if (groupedTasks) {
    Object.keys(groupedTasks).forEach((key) => {
      let sortedTaskList = groupedTasks[key].sort(sortByDate);
      groupedTasks[key] = sortedTaskList;
    });
  }
}

/**
 * Renders all tasks across different categories.
 * Calls the `renderTasksInCategory` function for each category of tasks with appropriate empty messages.
 */
function renderTasks() {
  let toDos = groupedTasks["to do"];
  let inProgressTasks = groupedTasks["in progress"];
  let awaitFeedbackTasks = groupedTasks["await feedback"];
  let doneTasks = groupedTasks["done"];

  renderTasksInCategory(toDos, "to-do", "No tasks to do");
  renderTasksInCategory(inProgressTasks, "in-progress", "No tasks in progress");
  renderTasksInCategory(
    awaitFeedbackTasks,
    "await-feedback",
    "No tasks awaiting feedback"
  );
  renderTasksInCategory(doneTasks, "done", "No tasks done");
}

/**
 * Renders tasks in a specific category column.
 *
 * @param {Array} categoryTasks - The array of tasks to be rendered in the specific category.
 * @param {string} categoryId - The ID of the target column where the tasks should be rendered.
 * @param {string} emptyMessage - The message to display when there are no tasks in this category.
 */
function renderTasksInCategory(categoryTasks, categoryId, emptyMessage) {
  let taskColumn = document.getElementById(categoryId);
  taskColumn.innerHTML = "";
  if (!Array.isArray(categoryTasks) || categoryTasks.length === 0) {
    taskColumn.innerHTML = `
    <div class="empty-column"><span>${emptyMessage}</span></div>
    `;
  } else {
    for (let i = 0; i < categoryTasks.length; i++) {
      let task = categoryTasks[i];
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
 * @param {number} index - The index of the task.
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
 * @param {number} index - The index of the task.
 */
function updateAvatars(assigned, taskId) {
  let avatars = document.getElementById(`ts-avatars${taskId}`);
  if (Array.isArray(assigned) && assigned.length > 0) {
    for (let j = 0; j < assigned.length; j++) {
      let userId = assigned[j];
      let user = users[getUserIndex(userId)];
      let marginLeft = j > 0 ? "-9px" : "0px";

      avatars.innerHTML += `
        <div class="ts-avatar" style="background-color: ${user.color
        }; z-index: ${j + 2}; margin-left: ${marginLeft};">${user.initials
        }</div>
      `;
    }
  }
}

/**
 * displays the details of a task
 * @param {*} id - the unique identifier of the task to be displayed
 */
function showTaskDetails(id) {
  let task = getTaskById(id);
  let date = formatDate(task.date);
  let priorityMarker = getPriorityMarker(task.priority);
  let overlay = createOverlay("task-details-overlay");
  overlay.innerHTML = getTaskLargeContentHtml(task, date, priorityMarker);
  showDetailsAssigned(task.assigned);
  showDetailsSubtask(task.subtasks, task.id);
  let taskDetails = document.getElementById("task-large");
  taskDetails.classList.add("slide-in");
}

/**
 * closes the task details overlay 
 */
function closeTaskDetails() {
  let taskDetails = document.getElementById("task-large");
  taskDetails.classList.add("slide-out");
  setTimeout(() => {
    let overlay = document.getElementById("task-details-overlay");
    if (overlay) {
      overlay.remove();
    }
    updateTasks();
    taskDetails.classList.remove("slide-out");
  }, 180);
}

/**
 * displays the details of the users assigned to a task
 * @param {*} assigned  - an array of user IDs assigned to the task
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
 * @param {*} subtasks - an array of subtasks related to the main task or false/undefined if there are none
 * @param {*} taskId - the unique identifier of the task to which the subtasks belong
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
 * @param {*} index - the index of the subtask within the subtasks array
 * @param {*} taskId - the unique identifier of the task to which the subtask belongs
 */
async function updateSubtaskFromDetails(index, taskId) {
  let checked = document.getElementById(`checkbox${index}`).checked;
  let task = getTaskById(taskId);
  if (task) {
    task.subtasks[index].done = checked;
    await putData("/tasks/", taskId, task);
  } else {
    console.error("Task not found with ID:", taskId);
  }
}

/**
 *  return a task from the tasks array based on its unique identifier
 * @param {*} id - the unique identifier of the task to be returned
 * @returns 
 */
function getTaskById(id) {
  let index = tasks.findIndex((task) => task["id"] == id);
  let task = tasks[index];
  return task;
}

/**
 *  opens an overlay for editing the details of a task
 * @param {*} id - the unique identifier of the task to be edited
 */
function editTask(id) {
  let task = getTaskById(id);
  let overlay = createOverlay("edit-task-overlay");
  overlay.innerHTML = getEditTaskContentHtml(task);
  insertContactsToInput();
  showEditSubtasks(task.subtasks, task.id);
  let oldOverlay = document.getElementById("task-details-overlay");
  oldOverlay.remove();
}


/**
 * saves the edited details of a task and updates the task data
 * @param {*} event - the event object associated with the form submission
 * @param {*} taskId - the unique identifier of the task being edited
 * @param {*} taskState - the current state of the task to be preserved during the update
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
 * @param {*} overlay - the ID of the overlay to be closed 
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
 * @param {*} taskId - the unique identifier of the task to be deleted
 */
async function deleteTask(taskId) {
  await deleteData("/tasks/", taskId);
  tasks = [];
  closeTaskDetails((overlay = "task-details-overlay"));
  updateTasks();
}

/**
 * displays the subtasks associated with a specific task for editing
 * @param {*} subtasks - an array of subtasks
 * @param {*} taskId - the unique identifier of the task to which the subtasks belong
 */
function showEditSubtasks(subtasks, taskId) {
  let subtaskContent = document.getElementById("addedsubtasks");
  if (subtasks) {
    for (let i = 0; i < subtasks.length; i++) {
      let subtask = subtasks[i];
      subtaskContent.innerHTML += addSubtaskHTML(subtask.name, i);
      document.getElementById(`subtask-${i}`).value = subtask.done;
      console.log(Boolean(document.getElementById(`subtask-${i}`).value));
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

function updateProgress(subtask, task) { }

/**
 * initializes and displays an overlay for adding a new task
 * @param {*} status - the status of the new task being added
 */
function addTaskBoard(status) {
  let overlay = createOverlay("add-task-board");
  overlay.innerHTML = addTaskBoardHTML(status);
  insertContactsToInput();
}

/**
 * Formats a date string from "YYYY-MM-DD" format to "MM/DD/YYYY" format.
 *
 * @param {string} dateString - The date string in "YYYY-MM-DD" format.
 * @returns {string} - The formatted date string in "MM/DD/YYYY" format.
 */
function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  const formattedDay = day.padStart(2, "0");
  const formattedMonth = month.padStart(2, "0");
  return `${formattedMonth}/${formattedDay}/${year}`;
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

/**
 * Counts the number of subtasks in a task based on the key 'name'.
 *
 * @param {Object[]} subtasks - An array of subtask objects.
 * @returns {number} - The number of subtasks.
 */
function countSubtaskNumber(subtasks) {
  if (!Array.isArray(subtasks)) {
    return 0;
  } else {
    let count = subtasks.filter((subtask) =>
      subtask.hasOwnProperty("name")
    ).length;
    return count;
  }
}

/**
 * Counts the number of subtasks where the key 'done' has a value of true.
 *
 * @param {Object[]} subtasks - An array of subtask objects.
 * @returns {number} - The number of subtasks where 'done' is set to true.
 */
function countCompletedSubtasks(subtasks) {
  if (!Array.isArray(subtasks)) {
    return 0;
  } else {
    return subtasks.filter((subtask) => subtask.done === true).length;
  }
}

/**
 * Calculates the percentage of completed subtasks relative to the total number of subtasks.
 *
 * @param {number} completedSubtasks - The number of completed subtasks.
 * @param {number} subtasksNumber - The total number of subtasks.
 * @returns {number} - The percentage of completed subtasks.
 */
function calculateCompletionPercentage(completedSubtasks, subtasksNumber) {
  if (subtasksNumber === 0) {
    return 0;
  }
  let percentage = (completedSubtasks / subtasksNumber) * 100;
  return percentage;
}

/**
 *  Toggles the visibility of the drag menu for a specific task.
 * @param {*} event - the event object that triggered the menu toggle
 * @param {*} clickedTask - the unique identifier of the task for which the 
 *                          drag menu is being displayed or hidden
 */
function toggleDragMenue(event, clickedTask) {
  event.stopPropagation();
  const dropdownMenu = document.getElementById(`drag-menue${clickedTask}`);
  if (dropdownMenu.style.display === "block") {
    dropdownMenu.style.display = "none";
  } else {
    dropdownMenu.style.display = "block";
  }
}

/**
 *  moves a task to a new area when triggered by a button click
 * @param {*} event - the event object that triggered the movement action
 * @param {*} newArea - the target area to which the task will be moved
 * @param {*} clickedTask - the unique identifier of the task being moved
 */
function moveByButton(event, newArea, clickedTask) {
  event.stopPropagation();
  toggleDragMenue(event, clickedTask);
  currentDraggedTask = clickedTask;
  moveTo(newArea);
}

/**
 * initiates the dragging process for a specified task
 * @param {*} event - the event object that represents the drag start action
 * @param {*} taskId - the unique identifier of the task being dragged
 */
function startDragging(event, taskId) {
  event.target.classList.add("dragged");
  currentDraggedTask = taskId;
  document.getElementById("to-do").classList.add("drag-area-highlight");
  document.getElementById("in-progress").classList.add("drag-area-highlight");
  document
    .getElementById("await-feedback")
    .classList.add("drag-area-highlight");
  document.getElementById("done").classList.add("drag-area-highlight");
}

/**
 * stops the dragging process and removes highlight from drop areas
 */
function stopDragging() {
  document.getElementById("to-do").classList.remove("drag-area-highlight");
  document
    .getElementById("in-progress")
    .classList.remove("drag-area-highlight");
  document
    .getElementById("await-feedback")
    .classList.remove("drag-area-highlight");
  document.getElementById("done").classList.remove("drag-area-highlight");
}

/**
 * highlights a designated drag area to indicate where a task can be dropped
 * @param {*} id - the unique identifier of the HTML element that serves as the drag area
 */
function highlightDragArea(id) {
  document.getElementById(id).classList.add("drag-over-highlight");
}

/**
 * removes the highlight from a designated drag area
 * @param {*} id - the unique identifier of the HTML element from which to remove the highlight
 */
function deleteHighlightDragArea(id) {
  document.getElementById(id).classList.remove("drag-over-highlight");
}

/**
 * Moves a task to a new area and updates its state
 * @param {*} newArea - the new state/area to which the task is being moved (e.g., 'to-do', 'in-progress')
 * @param {*} areaId - the unique identifier of the HTML element representing the area being targeted for the drop
 */
async function moveTo(newArea, areaId) {
  document.getElementById(areaId).classList.remove("drag-over-highlight");
  let task = getTaskById(currentDraggedTask);
  task.taskState = newArea;
  await putData("/tasks/", currentDraggedTask, task)
    .then(() => {
      console.log("Task moved successfully!");
    })
    .catch((error) => {
      console.error("Error moving Task:", error);
    });
  updateTasks();
}

/**
 * prevents the default behavior to allow drop actions on a drag target
 * @param {*} event - the event object representing the drag event
 */
function allowDrop(event) {
  event.preventDefault();
}
