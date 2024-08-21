/**
 * check if user is logged in
 */
function accessPage() {
  hasAccess = checkAuthState();
  if (hasAccess) {
    document.getElementById("body").style = "";
    document.onload = initContacts();
  } else window.location.replace("./login.html");
}
