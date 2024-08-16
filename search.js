/**
 * Searches for tasks based on the input string and updates the UI accordingly.
 * @returns 
 */
function searchTasks() {
  let searchString = document.getElementById("find-task").value;
  if (searchString.trim().length > 0) {
    document.getElementById("engage-search").style = "display: none;";
    document.getElementById("clear-search").style = "";
  }
  if (searchString.trim().length < 3) return;
  else renderSearch(searchString);
}

/**
 * Clears the search input and restores the visibility of all tasks. 
 */
function clearSearch() {
  document.getElementById("find-task").value = "";
  document.getElementById("engage-search").style = "";
  document.getElementById("clear-search").style = "display: none;";
  let nodelist = document.getElementsByClassName("task-small-main");
  let allTasks = Array.from(nodelist);
  for (let i = 0; i < allTasks.length; i++) {
    allTasks[i].style = "";
  }
}

/**
 * Renders the search results by showing only the tasks that match the search string.
 * @param {string} searchString - The string to search for among the task titles.
 */
function renderSearch(searchString) {
  let found = findIds(searchString);
  let matchingIds = found.map((task) => task.id);
  let nodelist = document.getElementsByClassName("task-small-main");
  let allTasks = Array.from(nodelist);
  for (let i = 0; i < allTasks.length; i++) {
    allTasks[i].style = "";
    if (matchingIds.includes(allTasks[i].id)) {
      continue;
    } else {
      allTasks[i].style = "display: none;";
    }
  }
}

/**
 * Finds tasks that match the search string by checking their titles and descriptions.
 * @param {string} searchString  - The string to search for within task titles and descriptions.
 * @returns {Array}  - An array of tasks that match the search criteria.
 */
function findIds(searchString) {
  let found = tasks.filter((task) => {
    if (task.title.includes(searchString)) return true;
    else if (task.description) {
      if (task.description.includes(searchString)) return true;
    } else return false;
  });
  return found;
}
