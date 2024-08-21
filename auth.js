/**
 * checks login token
 * @returns true / false after checking login token
 */
function checkAuthState() {
  let token = getToken();
  if (token == undefined) return false;
  else if (rememberIsSet(token) || tokenIsNew(token)) {
    passTokenData(token);
    renewToken(token);
    return true;
  } else return false;
}

/**
 * retrieves login token from local storage
 * @returns login token if there is one, else undefined
 */
function getToken() {
  let tokenString = localStorage.getItem("loginToken");
  if (tokenString !== null) {
    return JSON.parse(tokenString);
  } else return;
}

/**
 * checks remember me setting in login token
 * @param {object} token login token
 * @returns if remember me is set
 */
function rememberIsSet(token) {
  return token.remember === true;
}

/**
 * compares now to the time the login token was last updated
 * @param {object} token login token
 * @returns if login token is older than 1h
 */
function tokenIsNew(token) {
  let now = Math.floor(Date.now() / 1000);
  return now - 3600 < token.timestamp;
}

/**
 * saves token data to global variable
 * @param {object} token login token
 */
function passTokenData(token) {
  loggedIn = {
    name: token.name,
    initials: token.initials,
    greeting: token.greeting,
  };
}

/**
 * updates timestamp in login token
 * @param {object} token login token
 */
function renewToken(token) {
  setToken(token.name, token.initials, token.remember, false);
}
