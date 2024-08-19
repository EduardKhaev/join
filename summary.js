/**
 * initializes the task board by loading necessary data and rendering tasks
 */
async function initSummary() {
    await loadUsers();
    sortAllUsers();
    await loadTasks();
    await groupTasks();
    await tasksByDate();
    displayTaskStatistics();
}

/**
 * Displays task counts and greeting
 */
function displayTaskStatistics() {
    let toDos = groupedTasks["to do"];
    let doneTasks = groupedTasks["done"];
    let inProgressTasks = groupedTasks["in progress"];
    let awaitFeedbackTasks = groupedTasks["await feedback"];
    let totalTasks = tasks.length;

    document.getElementById('todoCount').innerText = toDos.length;
    document.getElementById('doneCount').innerText = doneTasks.length;
    document.getElementById('tasksInBoardCount').innerText = totalTasks;
    document.getElementById('tasksInProgressCount').innerText = inProgressTasks.length;
    document.getElementById('awaitingFeedbackCount').innerText = awaitFeedbackTasks.length;

    document.getElementById('greetingMessage').innerText = getGreetingMessage();
}

/**
 * Returns the appropriate greeting message based on the current hour.
 * @returns {string} - The greeting message.
 */
function getGreetingMessage() {
    let today = new Date();
    let curHr = today.getHours();

    if (curHr < 12) {
        return 'Good morning,';
    } else if (curHr >= 12 && curHr < 16) {
        return 'Good afternoon,';
    } else {
        return 'Good evening,';
    }
}