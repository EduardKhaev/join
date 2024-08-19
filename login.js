function loginAsGuest() {
  console.log("Guest logged in");
}

function validateLogin(event) {
  event.preventDefault();
  console.log("validation");
}

function showInvalidLogin(labelId, inputId) {
  document.getElementById(inputId).style.borderColor = "red";
  document.getElementById(labelId).style = "";
}

function removeInvalidLogin(labelId, inputId) {
  document.getElementById(inputId).style = "";
  document.getElementById(labelId).style = "opacity: 0;";
}
