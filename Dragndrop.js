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
  moveTo(newArea, "", false);
}

/**
 * Starts dragging a task by highlighting drag areas.
 *
 * @param {Event} event - The drag event.
 * @param {string} taskId - The ID of the task being dragged.
 */
/**
 * initiates the dragging process for a specified task
 * @param {*} event - the event object that represents the drag start action
 * @param {*} taskId - the unique identifier of the task being dragged
 */
function startDragging(event, taskId) {
  currentDraggedTask = taskId;
  highlightDragAreas();
}

/**
 * Stops dragging by removing highlights from all drag areas.
 */
function stopDragging() {
  let areas = ["to-do", "in-progress", "await-feedback", "done"];
  areas.forEach((areaId) => {
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

    await putData("/tasks/", currentDraggedTask, task);
    updateTasks();
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
  areas.forEach((areaId) => {
    let area = document.getElementById(areaId);
    area.classList.add("drag-area-highlight");
  });
}
