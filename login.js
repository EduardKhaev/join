function loginAsGuest() {
  console.log("Guest logged in");
}

function validateLogin(event) {
  event.preventDefault();
  let email, password;
  [email, password] = getLoginData();
}

function getLoginData() {}

function showInvalidLogin(labelId, inputId) {
  document.getElementById(inputId).style.borderColor = "red";
  document.getElementById(labelId).style = "";
}

function removeInvalidLogin(labelId, inputId) {
  document.getElementById(inputId).style = "";
  document.getElementById(labelId).style = "opacity: 0;";
}
