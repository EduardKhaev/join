function searchTasks() {
  let searchString = document.getElementById("find-task").value;
  if (searchString.trim().length > 0) {
    document.getElementById("engage-search").style = "display: none;";
    document.getElementById("clear-search").style = "";
  }
  if (searchString.trim().length < 3) return;
  else renderSearch(searchString);
}

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

function findIds(searchString) {
  let found = tasks.filter((task) => {
    if (task.title.includes(searchString)) return true;
    else if (task.description) {
      if (task.description.includes(searchString)) return true;
    } else return false;
  });
  return found;
}
