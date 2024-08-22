let registeredUsers = [{ 'name': 'max mustermann', 'e-mail': 'muster@gmx.de', 'pw': '12345', 'confirm-pw': '12345' }];

function validateSignUp(event) {
  // read data Max
  // compare passwords Max
  // save to db Galina
  // login user (new parameter for login after sign-up) Galina
}

function validateSignUp(event) {
  event.preventDefault();

  let [email, password, confirmPassword, name] = getSignUpFormData();

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

  registeredUsers.push(registeredUser);
  console.log(registeredUsers);
}

function getSignUpFormData() {
  let email = getSignUpFieldData("entermail");
  let password = getSignUpFieldData("enterpassword");
  let confirmPassword = getSignUpFieldData("enter-repeat-password");
  let name = getSignUpFieldData("entername");
  return [email, password, confirmPassword, name];
}

function getSignUpFieldData(inputId) {
  return document.getElementById(inputId).value;
}

function showInvalidSignUp(labelId, inputId) {
  document.getElementById(inputId).style.borderColor = "red";
  document.getElementById(labelId).style = "";
}

function passwordsDoNotMatch() {
  showInvalidSignUp("incorrect-repeat-pw", "enter-repeat-password");
}