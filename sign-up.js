let registeredUsers = [];

// function validateSignUp(event) {
// read data Max
// compare passwords Max
// save to db Galina
// login user (new parameter for login after sign-up) Galina
// }

/**
 * Validates the sign-up form data and processes user registration.
 * 
 * Prevents the default form submission, checks if the name contains at least
 * two words, ensures the passwords match, and creates a `registeredUser` object.
 *
 * @param {Event} event - The form submit event.
 * 
 * @returns {void} - No return value.
 */
async function validateSignUp(event) {
  event.preventDefault();

  let [email, password, confirmPassword, name] = getSignUpFormData();

  if (!validateName(name)) {
    return;
  }

  if (password !== confirmPassword) {
    passwordsDoNotMatch();
    return;
  }

  let registeredUser = {
    login: email,
    password: password,
    name: name,
    initials: getInitials(name),
  };

  await postData("/users", registeredUser);
  console.log(registeredUser);
  loginUser(registeredUser);
}

function loginUser(user){

  loggedIn.name = user.name;
  loggedIn.initials = user.initials;
  window.location.href = "login.html";
}

/**
 * Retrieves the sign-up form data from the input fields.
 *
 * @returns {Array<string>} An array containing the email, password, confirm password, and name from the form.
 */
function getSignUpFormData() {
  let email = getSignUpFieldData("entermail");
  let password = getSignUpFieldData("enterpassword");
  let confirmPassword = getSignUpFieldData("enter-repeat-password");
  let name = getSignUpFieldData("entername");
  return [email, password, confirmPassword, name];
}

/**
 * Retrieves the value from a specific input field.
 *
 * @param {string} inputId - The ID of the input field.
 * @returns {string} The value of the input field.
 */
function getSignUpFieldData(inputId) {
  return document.getElementById(inputId).value;
}

/**
 * Validates the name field to ensure it contains at least two words.
 *
 * @param {string} name - The name to validate.
 * @returns {boolean} - Returns true if the name contains at least two words, otherwise false.
 */
function validateName(name) {
  name = name.trim();

  if (!hasTwoWords(name)) {
    showInvalidLogin("two-words", "entername");
    return false;
  }
  
  return true;
}

/**
 * Shows an error message indicating that the passwords do not match.
 */
function passwordsDoNotMatch() {
  showInvalidLogin("incorrect-repeat-pw", "enter-repeat-password");
}

/**
 * Checks if the provided name contains at least two words.
 *
 * @param {string} name - The name to check.
 * @returns {boolean} - Returns true if the name contains at least two words, otherwise false.
 */
function hasTwoWords(name) {
  let words = name.split(" ").filter((word) => word.length > 0);
  return words.length >= 2;
}

function invalidAcceptCheck() {
  let elements = document.getElementsByClassName("unchecked");
  elements[0].style = "stroke: red;";
  document.getElementById("accept-text").style = "display: none";
  document.getElementById("accept-invalid").style = "";
}

function resetAcceptCheck() {
  document.getElementById("accept-text").style = "";
  document.getElementById("accept-invalid").style = "display: none";
}

