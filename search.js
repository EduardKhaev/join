function searchTasks() {
  console.log("search");
  let searchString = document.getElementById("find-task").value;
  if (searchString.trim().length > 0) {
    document.getElementById("engage-search").style = "display: none;";
    document.getElementById("clear-search").style = "";
  }
  if (searchString.trim().length < 3) return;
  else renderSearch(searchString);
}

function clearSearch() {
  console.log("clear");
  document.getElementById("find-task").value = "";
  document.getElementById("engage-search").style = "";
  document.getElementById("clear-search").style = "display: none;";
}

function renderSearch(searchString) {
  let found = findIds(searchString);
  console.log(found);
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
