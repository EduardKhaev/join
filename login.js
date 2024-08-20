let loginData = [
  {
    name: "Peter Müller",
    login: "peter.müller@test.de",
    password: "1234",
    initials: "PM",
  },
];

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

async function saveLoginData(data = {}) {
  if (data) await postData("/logindata", data);
}

async function getLoginData() {
  let userResponse = await fetch(FIREBASE_URL + path + ".json");
  let responseToJson = await userResponse.json();
  if (responseToJson) {
    Object.keys(responseToJson).forEach((key) => {
      users.push({
        id: key,
        name: responseToJson[key]["name"],
        phone: responseToJson[key]["phone"],
        email: responseToJson[key]["email"],
        color: responseToJson[key]["color"],
        initials: responseToJson[key]["initials"],
      });
    });
  }
}

async function loadUsers(path = "/names") {
  let userResponse = await fetch(FIREBASE_URL + path + ".json");
  let responseToJson = await userResponse.json();
  if (responseToJson) {
    Object.keys(responseToJson).forEach((key) => {
      users.push({
        id: key,
        name: responseToJson[key]["name"],
        phone: responseToJson[key]["phone"],
        email: responseToJson[key]["email"],
        color: responseToJson[key]["color"],
        initials: responseToJson[key]["initials"],
      });
    });
  }
}
