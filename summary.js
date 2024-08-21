/**
 * initializes the task board by loading necessary data and rendering tasks
 */
async function initSummary() {
  await loadUsers();
  sortAllUsers();
  await loadTasks();
  sortTasksByDate();
  await groupTasks();
  await tasksByDate();
  showGreetingAndUserName();
  displayTaskStatistics();
  showLoggedInInitials();
  //showWelcomeOverlay();
}

/**
 * shows the initials of the logged-in user
 */
function showLoggedInInitials() {
  if (loggedIn && loggedIn.name) {
    document.getElementById("user-profile-initials").innerHTML =
      loggedIn.initials;
  } else {
    document.getElementById("user-profile-initials").innerHTML = "G";
  }
}

/**
 * Sorts all tasks by their date property.
 */
function sortTasksByDate() {
  tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
}

/**
 * Displays task counts
 */
function displayTaskStatistics() {
  let toDos = groupedTasks["to do"] || [];
  let doneTasks = groupedTasks["done"] || [];
  let inProgressTasks = groupedTasks["in progress"] || [];
  let awaitFeedbackTasks = groupedTasks["await feedback"] || [];
  let urgentTasks = tasks.filter((task) => task.priority === "urgent");
  let totalTasks = tasks.length;

  document.getElementById("todoCount").innerHTML = toDos.length;
  document.getElementById("doneCount").innerHTML = doneTasks.length;
  document.getElementById("tasksInBoardCount").innerHTML = totalTasks;
  document.getElementById("tasksInProgressCount").innerHTML =
    inProgressTasks.length;
  document.getElementById("awaitingFeedbackCount").innerHTML =
    awaitFeedbackTasks.length;
  document.getElementById("urgentCount").innerHTML = urgentTasks.length;

  let nextTaskDeadline = getNextTaskDeadline(tasks);
  document.getElementById("nextDeadlineTask").innerHTML = nextTaskDeadline;
}

/**
 * Displays the appropriate greeting message based on the current hour and shows the name of the logged-in user.
 */
function showGreetingAndUserName() {
  if (loggedIn.greeting) {
    let today = new Date();
    let curHr = today.getHours();
    let greeting;
    if (curHr < 12) {
      greeting = "Good morning,";
    } else if (curHr >= 12 && curHr < 16) {
      greeting = "Good afternoon,";
    } else {
      greeting = "Good evening,";
    }
    document.getElementById("greetingMessage").innerHTML = greeting;
    document.getElementById("greetingUserName").innerHTML = loggedIn.name;
  }
}

/**
 * Returns the next task deadline from all tasks.
 * @param {Array} allTasks - The list of all tasks.
 * @returns {string} - The next task deadline
 */
function getNextTaskDeadline(allTasks) {
  let nextTask = allTasks[0];
  let date = new Date(nextTask.date);
  let options = { year: "numeric", month: "long", day: "numeric" };

  let formattedDate = date.toLocaleDateString("en-US", options);

  let today = new Date();
  if (date < today) {
    formattedDate = `<span style="color: red;">${formattedDate}</span>`;
  }

  return formattedDate;
}

//function showWelcomeOverlay() {
// let overlay = document.getElementById("welcomeOverlay");
//  let welcomeUserNameElement = document.getElementById("welcomeUserName");
//  welcomeUserNameElement.innerHTML = loggedIn.name;
//  overlay.style.display = "flex";
//setTimeout(() => {
//  overlay.classList.add("hide");
// setTimeout(() => {
//      overlay.style.display = "none";
//  }, 1000);
// }, 3000);
//}
