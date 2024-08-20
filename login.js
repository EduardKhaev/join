let loginData = [];

function loginAsGuest(event) {
  event.preventDefault();
  console.log("Guest logged in");
}

function validateLogin(event) {
  event.preventDefault();
  let [email, password] = getLoginFormData();
  checkLoginData(email, password);
}

function checkLoginData(username, password) {
  console.log(username, password);
}

function getLoginFormData() {
  let email = getLoginFieldData("entermail");
  let password = getLoginFieldData("enterpassword");
  return [email, password];
}

function getLoginFieldData(field) {
  return document.getElementById(field).value;
}

function showInvalidLogin(labelId, inputId) {
  document.getElementById(inputId).style.borderColor = "red";
  document.getElementById(labelId).style = "";
}

function removeInvalidLogin(labelId, inputId) {
  document.getElementById(inputId).style = "";
  document.getElementById(labelId).style = "opacity: 0;";
}

function unknownUser() {
  console.log("Username not registered");
}

function incorrectPassword() {
  console.log("Password not correct");
}
