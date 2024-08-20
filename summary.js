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
    displayTaskStatistics();    

}

/**
 * Sorts all tasks by their date property.
 */
function sortTasksByDate() {
    tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
}

/**
 * Displays task counts and greeting
 */
function displayTaskStatistics() {
    if (tasks.length > 0) {
        let toDos = groupedTasks["to do"] || [];
        let doneTasks = groupedTasks["done"] || [];
        let inProgressTasks = groupedTasks["in progress"] || [];
        let awaitFeedbackTasks = groupedTasks["await feedback"] || [];
        let totalTasks = tasks.length;

        document.getElementById('todoCount').innerHTML = toDos.length;
        document.getElementById('doneCount').innerHTML = doneTasks.length;
        document.getElementById('tasksInBoardCount').innerHTML = totalTasks;
        document.getElementById('tasksInProgressCount').innerHTML = inProgressTasks.length;
        document.getElementById('awaitingFeedbackCount').innerHTML = awaitFeedbackTasks.length;

        document.getElementById('greetingMessage').innerHTML = getGreetingMessage();

        let nextTaskDeadline = getNextTaskDeadline(tasks);
        document.getElementById('nextDeadlineTask').innerHTML = nextTaskDeadline;
    }

    else {
        document.getElementById('todoCount').innerHTML = 0;
        document.getElementById('doneCount').innerHTML = 0;
        document.getElementById('tasksInBoardCount').innerHTML = 0;
        document.getElementById('tasksInProgressCount').innerHTML = 0;
        document.getElementById('awaitingFeedbackCount').innerHTML = 0;
    }
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

/**
 * Returns the next task deadline from all tasks.
 * @param {Array} allTasks - The list of all tasks.
 * @returns {string} - The next task deadline 
 */
function getNextTaskDeadline(allTasks) {
    let nextTask = allTasks[0];
    console.log(allTasks);
    let date = new Date(nextTask.date);
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    let formattedDate = date.toLocaleDateString('en-US', options);

    return ` ${formattedDate}`;
   
}