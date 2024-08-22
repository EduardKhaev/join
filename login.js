/**
 * log on anonymously with a guest sign in
 * @param {event} event click event
 */
function loginAsGuest(event) {
  event.preventDefault();
  loginUser("Guest", "G");
}

/**
 * log-out user / remove login token
 */
function logoutUser() {
  localStorage.removeItem("loginToken");
  window.location.replace("./login.html");
}

/**
 * get the login data from form and compare with db data
 * @param {event} event click event
 */
function validateLogin(event) {
  event.preventDefault();
  let [email, password] = getLoginFormData();
  checkLoginData(email, password);
}

/**
 * compare user provided login information to db and trigger reaction
 * @param {string} username username from input
 * @param {string} password username from input
 */
async function checkLoginData(username, password) {
  let loginData = await getLoginData();
  let index = findLoginName(loginData, username);
  if (index === -1 || index == undefined) unknownUser();
  else {
    let pwFromDb = loginData[index]["password"];
    if (pwFromDb !== password) incorrectPassword();
    else loginUser(loginData[index]["name"], loginData[index]["initials"]);
  }
}

/**
 * login user with user data from db and input
 * @param {string} displayName name of user from db
 * @param {string} initials initials of user
 */
function loginUser(displayName, initials, fromLogIn = true) {
  let remember = false;
  if (fromLogIn) remember = document.getElementById("remember").checked;
  setToken(displayName, initials, remember, true);
  window.location.replace("./summary.html");
}

/**
 * set login token with user information
 * @param {string} displayName name of user from db
 * @param {*} initials initials of user
 * @param {*} remember stay logged in from input
 * @param {*} greeting states if user shall be greeted
 * @returns
 */
function setToken(displayName, initials, remember, greeting) {
  let timestamp = Math.floor(Date.now() / 1000);
  let loginToken = {
    name: displayName,
    initials: initials,
    remember: remember,
    timestamp: timestamp,
    greeting: greeting,
  };
  saveToken(loginToken);
  return;
}

/**
 * save login token to local storage
 * @param {object} loginToken object with user information to handle login state
 */
function saveToken(loginToken) {
  let stringToken = JSON.stringify(loginToken);
  localStorage.setItem("loginToken", stringToken);
}

/**
 * find index of userdata with provided username
 * @param {object} loginData from db with user information
 * @param {string} username username from input
 * @returns index in Array or -1
 */
function findLoginName(loginData, username) {
  let index = loginData.findIndex((user) => user["login"] == username);
  return index;
}

/**
 * collect data from form fields
 * @returns user input data
 */
function getLoginFormData() {
  let email = getLoginFieldData("entermail");
  let password = getLoginFieldData("enterpassword");
  return [email, password];
}

/**
 *
 * @param {string} field id of input field
 * @returns value from user input
 */
function getLoginFieldData(field) {
  return document.getElementById(field).value;
}

/**
 * change style of elements after invalid input
 * @param {string} labelId HTML Element id
 * @param {string} inputId HTML Element id
 */
function showInvalidLogin(labelId, inputId) {
  document.getElementById(inputId).style.borderColor = "red";
  document.getElementById(labelId).style = "";
}

/**
 * remove styling after input gets focus
 * @param {string} labelId HTML Element id
 * @param {string} inputId HTML Element id
 */
function removeInvalidLogin(labelId, inputId) {
  document.getElementById(inputId).style = "";
  let label = document.getElementById(labelId);
  label.firstChild.style = "display: none";
  label.lastChild.style = "display: none";
}

/**
 * if username provided in input field has no match in db
 */
function unknownUser() {
  showInvalidLogin("user-unknown", "entermail");
}

/**
 * password incorrect
 */
function incorrectPassword() {
  showInvalidLogin("incorrect-pw", "enterpassword");
}

/**
 * save user information to db
 * @param {object} data user information
 */
async function saveLoginData(data = {}) {
  if (data) await postData("/logindata", data);
}

/**
 * read user login information from db
 * @returns array of objects with user information
 */
async function getLoginData() {
  let loginData = [];
  let userResponse = await fetch(FIREBASE_URL + "/logindata" + ".json");
  let responseToJson = await userResponse.json();
  if (responseToJson) {
    Object.keys(responseToJson).forEach((key) => {
      loginData.push({
        id: key,
        name: responseToJson[key]["name"],
        login: responseToJson[key]["login"],
        password: responseToJson[key]["password"],
        initials: responseToJson[key]["initials"],
      });
    });
  }
  return loginData;
}
