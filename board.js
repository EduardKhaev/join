let tasks = [];

async function initBoard() {
  await loadUsers();
  sortAllUsers();
  await loadTasks();
  renderTasks();
}

async function loadTasks() {}

function renderTasks() {}

function searchTasks(searchterm) {}

function showTaskDetails() {}

function editTask(Index) {}

function deleteTask(Index) {}

function updateProgress(subtask, task) {}

function addTaskBoard() {} //Eduard

function addTaskStatus() {} //Eduard

