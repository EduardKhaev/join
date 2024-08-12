let tasks = [];
let groupedTasks = {};

async function initBoard() {
  await loadUsers();
  showTaskDetails();
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

function renderTasks() {
  console.log(tasks);
  console.log(groupedTasks["to do"]);
}

function searchTasks(searchterm) {}

function showTaskDetails() {
  let task = protoTask;
  let date = formatDate(task.date);
  let priorityMarker = getPriorityMarker(task.priority);
  let taskContent = document.getElementById("task-large");
  taskContent.innerHTML = getTaskLargeContentHtml(task, date, priorityMarker);

  let assigned = task.assigned;
  for (let j = 0; j < assigned.length; j++) {
    let userId  = assigned[j];
    let index = getUserIndex(userId);
    let user = users[index];
    
    let assignments = document.getElementById("tl-persons");
    assignments.innerHTML += getAssignmentsHtml(user);  
  };  

  let subtasks = task.subtasks;
  for (let i = 0; i < subtasks.length; i++) {
    let subtask = subtasks[i];
    let subtaskContent = document.getElementById("tl-sub-checks");
    subtaskContent.innerHTML += getSubtaskContentHtml(subtask);
  }
}

function editTask(Index) {}

function deleteTask(Index) {}

function updateProgress(subtask, task) {}

function addTaskBoard() {} //Eduard

function addTaskStatus() {} //Eduard


function formatDate(dateString) {
  const [year, month, day] = dateString.split('-');
  const formattedDay = day.padStart(2, '0');
  const formattedMonth = month.padStart(2, '0');
  return `${formattedMonth}/${formattedDay}/${year}`;
}