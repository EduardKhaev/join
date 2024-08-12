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
  console.log(groupedTasks);
}

function searchTasks(searchterm) {}

function showTaskDetails() {
  let task = protoTask;
  let date = formatDate(task.date);
  let priorityMarker = getPriorityMarker(task.priority);
  let taskContent = document.getElementById("task-large");
  taskContent.innerHTML = getTaskLargeContentHtml(task, date, priorityMarker);
  showDetailsAssigned(task.assigned);
  showDetailsSubtask(task.subtasks);
}

function showDetailsAssigned(assigned) {
  for (let i = 0; i < assigned.length; i++) {
    let userId = assigned[i];
    let index = getUserIndex(userId);
    let user = users[index];
    let assignments = document.getElementById("tl-persons");
    assignments.innerHTML += getAssignmentsHtml(user);
  }
}

function showDetailsSubtask(subtasks) {
  for (let i = 0; i < subtasks.length; i++) {
    let subtask = subtasks[i];
    let subtaskContent = document.getElementById("tl-sub-checks");
    subtaskContent.innerHTML += getSubtaskContentHtml(subtask, i);
  }
}

function editTask(Index) {}

function deleteTask(Index) {}

function updateProgress(subtask, task) {}

function addTaskBoard() {
  let overlay = createOverlay("add-task-board");
  overlay.innerHTML = `
      <div class="addtask-overlaycontainer">
        <form onsubmit="createTask(event)">
          <div class="at-headline-maincontainer">
            <h1>Add Task</h1>
          </div>
          <div class="at-body-maincontainer">
            <div class="at-body-leftinput">
              <div>
                <label for="entertitle"
                  >Title<span class="required">*</span></label
                >
                <input
                  required=""
                  oninvalid="event.preventDefault(); showInvalid(this); validateCategory()"
                  onfocus="removeInvalid(this)"
                  class="inputfield-basic-design"
                  type="text"
                  id="entertitle"
                  name="title"
                  placeholder="Enter a title"
                />
              </div>
              <div>
                <label for="task-description">Description</label>
                <textarea
                  class="inputfield-basic-design"
                  id="task-description"
                  name="description"
                  placeholder="Enter a Description"
                ></textarea>
              </div>
              <div>
                <label for="assignedTo">Assigned to</label>
                <details class="inputfield-basic-design">
                  <summary>
                    <span class="summary-text">Select contacts to assign</span>
                  </summary>
                  <fieldset>
                    <legend>Contacts</legend>
                    <ul id="contactDropDown"></ul>
                  </fieldset>
                </details>
              </div>
              <div class="selected-contacts" id="selected-contacts"></div>
            </div>
            <div class="at-body-emptydiv"></div>
            <div class="at-body-rightinput">
              <label for="due-date"
                >Due date<span class="required">*</span></label
              >
              <input
                required=""
                oninvalid="event.preventDefault(); showInvalid(this); validateCategory()"
                onfocus="removeInvalid(this)"
                class="inputfield-basic-design"
                type="date"
                name="begin"
                id="due-date"
                placeholder="dd/mm/yyyy"
                value=""
                min="2024-08-08"
                required
              />
              <label class="label-spacing" for="priority">Prio</label>
              <div class="outer">
                <button
                  class="urgency-button urgent-button"
                  id="urgent-button"
                  onclick="setUrgency(event, 'urgent')"
                >
                  Urgent
                  <svg
                    width="21"
                    height="16"
                    viewBox="0 0 21 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.2597 15.4464C19.0251 15.4468 18.7965 15.3719 18.6077 15.2328L10.3556 9.14965L2.10356 15.2328C1.98771 15.3184 1.85613 15.3803 1.71633 15.4151C1.57652 15.4498 1.43124 15.4567 1.28877 15.4354C1.14631 15.414 1.00944 15.3648 0.885997 15.2906C0.762552 15.2164 0.654943 15.1186 0.569314 15.0029C0.483684 14.8871 0.421712 14.7556 0.386936 14.6159C0.352159 14.4762 0.345259 14.331 0.366629 14.1887C0.409788 13.9012 0.565479 13.6425 0.799451 13.4697L9.70356 6.89926C9.89226 6.75967 10.1208 6.68433 10.3556 6.68433C10.5904 6.68433 10.819 6.75967 11.0077 6.89926L19.9118 13.4697C20.0977 13.6067 20.2356 13.7988 20.3057 14.0186C20.3759 14.2385 20.3747 14.4749 20.3024 14.6941C20.2301 14.9133 20.0904 15.1041 19.9031 15.2391C19.7159 15.3742 19.4907 15.4468 19.2597 15.4464Z"
                      fill="#FF3D00"
                    />
                    <path
                      d="M19.2597 9.69733C19.0251 9.69774 18.7965 9.62289 18.6077 9.48379L10.3556 3.40063L2.10356 9.48379C1.86959 9.6566 1.57651 9.72945 1.28878 9.68633C1.00105 9.6432 0.742254 9.48762 0.569318 9.25383C0.396382 9.02003 0.323475 8.72716 0.366634 8.43964C0.409793 8.15213 0.565483 7.89352 0.799455 7.72072L9.70356 1.15024C9.89226 1.01065 10.1208 0.935303 10.3556 0.935303C10.5904 0.935303 10.819 1.01065 11.0077 1.15024L19.9118 7.72072C20.0977 7.85763 20.2356 8.04974 20.3057 8.26962C20.3759 8.4895 20.3747 8.72591 20.3024 8.94509C20.2301 9.16427 20.0904 9.35503 19.9031 9.49012C19.7159 9.62521 19.4907 9.69773 19.2597 9.69733Z"
                      fill="#FF3D00"
                    />
                  </svg>
                </button>
                <button
                  class="urgency-button medium-button medium-active"
                  id="medium-button"
                  onclick="setUrgency(event, 'medium')"
                >
                  Medium<svg
                    width="21"
                    height="8"
                    viewBox="0 0 21 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.7596 7.91693H1.95136C1.66071 7.91693 1.38197 7.80063 1.17645 7.59362C0.970928 7.3866 0.855469 7.10584 0.855469 6.81308C0.855469 6.52032 0.970928 6.23955 1.17645 6.03254C1.38197 5.82553 1.66071 5.70923 1.95136 5.70923H19.7596C20.0502 5.70923 20.329 5.82553 20.5345 6.03254C20.74 6.23955 20.8555 6.52032 20.8555 6.81308C20.8555 7.10584 20.74 7.3866 20.5345 7.59362C20.329 7.80063 20.0502 7.91693 19.7596 7.91693Z"
                      fill="#FFA800"
                    />
                    <path
                      d="M19.7596 2.67376H1.95136C1.66071 2.67376 1.38197 2.55746 1.17645 2.35045C0.970928 2.14344 0.855469 1.86267 0.855469 1.56991C0.855469 1.27715 0.970928 0.996386 1.17645 0.789374C1.38197 0.582363 1.66071 0.466064 1.95136 0.466064L19.7596 0.466064C20.0502 0.466064 20.329 0.582363 20.5345 0.789374C20.74 0.996386 20.8555 1.27715 20.8555 1.56991C20.8555 1.86267 20.74 2.14344 20.5345 2.35045C20.329 2.55746 20.0502 2.67376 19.7596 2.67376Z"
                      fill="#FFA800"
                    />
                  </svg>
                </button>
                <button
                  class="urgency-button low-button"
                  id="low-button"
                  onclick="setUrgency(event, 'low')"
                >
                  Low<svg
                    width="21"
                    height="16"
                    viewBox="0 0 21 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.8555 9.69779C10.6209 9.69819 10.3923 9.62335 10.2035 9.48427L1.30038 2.91453C1.18454 2.82898 1.0867 2.72146 1.01245 2.59812C0.938193 2.47478 0.888977 2.33803 0.867609 2.19569C0.824455 1.90821 0.897354 1.61537 1.07027 1.3816C1.24319 1.14782 1.50196 0.992265 1.78965 0.949143C2.07734 0.906021 2.3704 0.978866 2.60434 1.15165L10.8555 7.23414L19.1066 1.15165C19.2224 1.0661 19.354 1.00418 19.4938 0.969432C19.6336 0.934685 19.7788 0.927791 19.9213 0.949143C20.0637 0.970495 20.2006 1.01967 20.324 1.09388C20.4474 1.16808 20.555 1.26584 20.6407 1.3816C20.7263 1.49735 20.7883 1.62882 20.823 1.7685C20.8578 1.90818 20.8647 2.05334 20.8433 2.19569C20.822 2.33803 20.7727 2.47478 20.6985 2.59812C20.6242 2.72146 20.5264 2.82898 20.4106 2.91453L11.5075 9.48427C11.3186 9.62335 11.0901 9.69819 10.8555 9.69779Z"
                      fill="#7AE229"
                    />
                    <path
                      d="M10.8555 15.4463C10.6209 15.4467 10.3923 15.3719 10.2035 15.2328L1.30038 8.66307C1.06644 8.49028 0.910763 8.2317 0.867609 7.94422C0.824455 7.65674 0.897354 7.3639 1.07027 7.13013C1.24319 6.89636 1.50196 6.7408 1.78965 6.69768C2.07734 6.65456 2.3704 6.7274 2.60434 6.90019L10.8555 12.9827L19.1066 6.90019C19.3405 6.7274 19.6336 6.65456 19.9213 6.69768C20.209 6.7408 20.4678 6.89636 20.6407 7.13013C20.8136 7.3639 20.8865 7.65674 20.8433 7.94422C20.8002 8.2317 20.6445 8.49028 20.4106 8.66307L11.5075 15.2328C11.3186 15.3719 11.0901 15.4467 10.8555 15.4463Z"
                      fill="#7AE229"
                    />
                  </svg>
                </button>
              </div>
              <label for="categoryLabel"
                >Category<span class="required">*</span></label
              >
              <details id="dropdown" class="inputfield-basic-design">
                <summary>
                  <span id="dropdown-title" class="summary-text"
                    >Select task category</span
                  >
                </summary>
                <ul>
                  <li
                    class="dropdown-item"
                    data-value="Technical Task"
                    onclick="selectCategory(this)"
                  >
                    <span class="assigned-person">Technical Task</span>
                  </li>
                  <li
                    class="dropdown-item"
                    data-value="User Story"
                    onclick="selectCategory(this)"
                  >
                    <span class="assigned-person">User Story</span>
                  </li>
                </ul>
              </details>
              <label for="subtasks">Subtasks</label>
              <div class="subtask-field">
                  <input class="subtasks-input" type="text" id="subtasks" placeholder="Add new subtask" />
                  <div onclick="clearSubtask(event)">
                      <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3.14453 18C2.59453 18 2.1237 17.8042 1.73203 17.4125C1.34036 17.0208 1.14453 16.55 1.14453 16V3C0.861198 3 0.623698 2.90417 0.432031 2.7125C0.240365 2.52083 0.144531 2.28333 0.144531 2C0.144531 1.71667 0.240365 1.47917 0.432031 1.2875C0.623698 1.09583 0.861198 1 1.14453 1H5.14453C5.14453 0.716667 5.24036 0.479167 5.43203 0.2875C5.6237 0.0958333 5.8612 0 6.14453 0H10.1445C10.4279 0 10.6654 0.0958333 10.857 0.2875C11.0487 0.479167 11.1445 0.716667 11.1445 1H15.1445C15.4279 1 15.6654 1.09583 15.857 1.2875C16.0487 1.47917 16.1445 1.71667 16.1445 2C16.1445 2.28333 16.0487 2.52083 15.857 2.7125C15.6654 2.90417 15.4279 3 15.1445 3V16C15.1445 16.55 14.9487 17.0208 14.557 17.4125C14.1654 17.8042 13.6945 18 13.1445 18H3.14453ZM3.14453 3V16H13.1445V3H3.14453ZM5.14453 13C5.14453 13.2833 5.24036 13.5208 5.43203 13.7125C5.6237 13.9042 5.8612 14 6.14453 14C6.42786 14 6.66536 13.9042 6.85703 13.7125C7.0487 13.5208 7.14453 13.2833 7.14453 13V6C7.14453 5.71667 7.0487 5.47917 6.85703 5.2875C6.66536 5.09583 6.42786 5 6.14453 5C5.8612 5 5.6237 5.09583 5.43203 5.2875C5.24036 5.47917 5.14453 5.71667 5.14453 6V13ZM9.14453 13C9.14453 13.2833 9.24037 13.5208 9.43203 13.7125C9.6237 13.9042 9.8612 14 10.1445 14C10.4279 14 10.6654 13.9042 10.857 13.7125C11.0487 13.5208 11.1445 13.2833 11.1445 13V6C11.1445 5.71667 11.0487 5.47917 10.857 5.2875C10.6654 5.09583 10.4279 5 10.1445 5C9.8612 5 9.6237 5.09583 9.43203 5.2875C9.24037 5.47917 9.14453 5.71667 9.14453 6V13Z" fill="#2A3647"/>
                      </svg>
                  </div>
                  <hr />
                  <div onclick="addSubtask(event)">
                      <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.69474 9.15L14.1697 0.675C14.3697 0.475 14.6072 0.375 14.8822 0.375C15.1572 0.375 15.3947 0.475 15.5947 0.675C15.7947 0.875 15.8947 1.1125 15.8947 1.3875C15.8947 1.6625 15.7947 1.9 15.5947 2.1L6.39474 11.3C6.19474 11.5 5.96141 11.6 5.69474 11.6C5.42807 11.6 5.19474 11.5 4.99474 11.3L0.694738 7C0.494738 6.8 0.398905 6.5625 0.407238 6.2875C0.415572 6.0125 0.519738 5.775 0.719738 5.575C0.919738 5.375 1.15724 5.275 1.43224 5.275C1.70724 5.275 1.94474 5.375 2.14474 5.575L5.69474 9.15Z" fill="#2A3647"/>
                      </svg>
                  </div>
              </div>
              <ul class="addedsubtasks" id="addedsubtasks"></ul>
            </div>
          </div>
          <div class="at-footer-maincontainer">
            <div class="at-footer-requiredtext">
              <span>*This field is required</span>
            </div>
            <div class="at-footer-buttoncontainer">
              <button onclick="clearTaskForm(event)" class="button-secondary">
                Clear <img src="img/close.png" alt="" />
              </button>
  
              <button type="submit" class="button-primary action-button-text">
                Create Task <img src="img/check.png" alt="" />
              </button>
            </div>
          </div>
        </form>
      </div>
      `;
} //Eduard

function addTaskStatus() {} //Eduard

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  const formattedDay = day.padStart(2, "0");
  const formattedMonth = month.padStart(2, "0");
  return `${formattedMonth}/${formattedDay}/${year}`;
}
