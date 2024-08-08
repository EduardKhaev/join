let selectedUrgency = "";

async function initTask() {
  await loadUsers();
  sortAllUsers();
  insertContactsToInput();
}

function insertContactsToInput() {
  console.log(users.length);

  // document.getElementById('day').options.add(new Option("text", "value"))
}

function setUrgency(event, urgency) {
  event.stopPropagation();
  if (selectedUrgency) clearUrgencyButton(selectedUrgency);
  selectedUrgency = urgency;
  setActiveUrgencyButton(selectedUrgency);
}

function clearUrgencyButton(oldUrgency) {
  let button = document.getElementById(`${oldUrgency}-button`);
  button.classList.remove(`${oldUrgency}-active`);
}

function setActiveUrgencyButton(selectedUrgency) {
  let button = document.getElementById(`${selectedUrgency}-button`);
  button.classList.add(`${selectedUrgency}-active`);
}
