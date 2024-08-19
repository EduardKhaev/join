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

    console.log(`To-Do: ${toDos.length}`);
    console.log(`Done: ${doneTasks.length}`);
    console.log(`Tasks in Progress: ${inProgressTasks.length}`);
    console.log(`Awaiting Feedback: ${awaitFeedbackTasks.length}`);
    console.log(`Tasks in Board: ${totalTasks}`);

    let today = new Date();
    let curHr = today.getHours();

    if (curHr < 12) {
        console.log('Good morning');
    } else if (curHr >= 12 && curHr < 16) {
        console.log('Good afternoon');
    } else {
        console.log('Good evening');
    }
}

