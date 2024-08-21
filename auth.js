function checkAuthState() {
  let token = getToken();
  if (token == undefined) return false;
  else if (rememberIsSet(token) || tokenIsNew(token)) {
    passTokenData(token);
    renewToken(token);
    return true;
  } else return false;
}

function getToken() {
  let tokenString = localStorage.getItem("loginToken");
  if (tokenString !== null) {
    return JSON.parse(tokenString);
  } else return;
}

function rememberIsSet(token) {
  return token.remember === true;
}

function tokenIsNew(token) {
  let now = Math.floor(Date.now() / 1000);
  return now - 3600 < token.timestamp;
}

function passTokenData(token) {
  loggedIn = {
    name: token.name,
    initials: token.initials,
    greeting: token.greeting,
  };
}

function renewToken(token) {
  setToken(token.name, token.initials, token.remember, false);
}
