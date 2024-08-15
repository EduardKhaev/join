let tasks = [];
let groupedTasks = {};
let currentDraggedTask;

async function initBoard() {
  await loadUsers();
  sortAllUsers();
  await loadTasks();
  await groupTasks();
  await tasksByDate();
  renderTasks();
}

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

async function groupTasks() {
  if (tasks) groupedTasks = Object.groupBy(tasks, ({ taskState }) => taskState);
}

async function tasksByDate() {
  if (groupedTasks) {
    Object.keys(groupedTasks).forEach((key) => {
      let sortedTaskList = groupedTasks[key].sort(sortByDate);
      groupedTasks[key] = sortedTaskList;
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
  renderTasksInArea(awaitFeedbackTasks, "await-feedback", "No tasks awaiting feedback");
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
      let percentage = calculateCompletionPercentage(completedSubtasks, subtasksNumber);
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

function showTaskDetails(id) {
  let task = getTaskById(id);

  let date = formatDate(task.date);
  let priorityMarker = getPriorityMarker(task.priority);
  let overlay = createOverlay("task-details-overlay");
  overlay.innerHTML = getTaskLargeContentHtml(task, date, priorityMarker);
  showDetailsAssigned(task.assigned);
  showDetailsSubtask(task.subtasks, task.id);
}

function closeTaskDetails(overlay = "task-details-overlay") {
  document.getElementById(overlay).remove();
  updateTasks();
}

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

function getTaskById(id) {
  let index = tasks.findIndex((task) => task["id"] == id);
  let task = tasks[index];
  return task;
}

function editTask(id) {
  let task = getTaskById(id);
  let overlay = createOverlay("edit-task-overlay");
  overlay.innerHTML = getEditTaskContentHtml(task);
  insertContactsToInput();
  showEditSubtasks(task.subtasks, task.id);
}

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

function updateTasks() {
  tasks = [];
  users = [];
  initBoard();
}

function closeEditTask(overlay = "edit-task-overlay") {
  document.getElementById(overlay).remove();
  document.getElementById("task-details-overlay").remove();
}

async function deleteTask(taskId) {
  await deleteData("/tasks/", taskId);
  tasks = [];
  closeTaskDetails((overlay = "task-details-overlay"));
  updateTasks();
}

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

function toggleDragMenue(event, clickedTask) {
  event.stopPropagation();
  const dropdownMenu = document.getElementById(`drag-menue${clickedTask}`);
  if (dropdownMenu.style.display === "block") {
    dropdownMenu.style.display = "none";
  } else {
    dropdownMenu.style.display = "block";
  }
}

function moveByButton(event, newArea, clickedTask) {
  event.stopPropagation();
  toggleDragMenue(event, clickedTask);
  currentDraggedTask = clickedTask;
  moveTo(newArea, "", false);
}

/**
 * Starts dragging a task by highlighting drag areas.
 *
 * @param {Event} event - The drag event.
 * @param {string} taskId - The ID of the task being dragged.
 */
function startDragging(event, taskId) {
  currentDraggedTask = taskId;
  // let ghostElement = event.target.cloneNode(true);
  // ghostElement.classList.add('drag-ghost');
  // document.body.appendChild(ghostElement);
  // event.dataTransfer.setDragImage(ghostElement, 0, 0);

  highlightDragAreas();
}

/**
 * Stops dragging by removing highlights from all drag areas.
 */
function stopDragging() {
  let areas = ["to-do", "in-progress", "await-feedback", "done"];
  areas.forEach(areaId => {
    let area = document.getElementById(areaId);
    area.classList.remove("drag-area-highlight");
  });
}

/**
 * Highlights a drag area when an element is dragged over it.
 *
 * @param {string} areaId - The ID of the drag area to highlight.
 */
function highlightDragArea(areaId) {
  let area = document.getElementById(areaId);
  area.classList.add("drag-over-highlight");
}

/**
 * Removes the highlight from a drag area when an element is dragged out of it.
 *
 * @param {string} areaId - The ID of the drag area to remove the highlight from.
 */
function deleteHighlightDragArea(areaId) {
  let area = document.getElementById(areaId);
  area.classList.remove("drag-over-highlight");
}

/**
 * Moves a task to a new area and updates the task's state in the database.
 *
 * @param {string} newArea - The new area to move the task to.
 * @param {string} areaId - The ID of the area where the task is dropped.
 * @param {boolean} [dragged=true] - Indicates if the drag was completed.
 */
async function moveTo(newArea, areaId, dragged = true) {
  if (dragged) {
    deleteHighlightDragArea(areaId);
  }

  let task = getTaskById(currentDraggedTask);
  if (task) {
    task.taskState = newArea;

    await putData("/tasks/", currentDraggedTask, task)
      .then(() => {
        console.log("Task moved successfully!");
      })
      .catch((error) => {
        console.error("Error moving task:", error);
      });

    updateTasks();
  } else {
    console.error("Task not found with ID:", currentDraggedTask);
  }
}

/**
 * Prevents the default handling of a dragover event to allow dropping.
 *
 * @param {Event} event - The dragover event.
 */
function allowDrop(event) {
  event.preventDefault();
}

/**
 * Highlights all drag areas.
 */
function highlightDragAreas() {
  let areas = ["to-do", "in-progress", "await-feedback", "done"];
  areas.forEach(areaId => {
    let area = document.getElementById(areaId);
    area.classList.add("drag-area-highlight");
  });
}