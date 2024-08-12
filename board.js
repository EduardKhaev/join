let tasks = [];
let groupedTasks = {};

async function initBoard() {
  await loadUsers();
  sortAllUsers();
  await loadTasks();
  await groupTasks();
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
  groupedTasks = Object.groupBy(tasks, ({ taskState }) => taskState);
}

function renderTasks() {
  console.log(tasks);
  console.log(groupedTasks["to do"]);
}

function searchTasks(searchterm) {}

function showTaskDetails() {}

function editTask(Index) {}

function deleteTask(Index) {}

function updateProgress(subtask, task) {}

function addTaskBoard() {} //Eduard

function addTaskStatus() {} //Eduard
