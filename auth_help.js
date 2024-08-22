/**
 * check if user is logged in
 */
function accessPage() {
  hasAccess = checkAuthState();
  if (hasAccess) {
    document.getElementById("body").style = "";
  } else window.location.replace("./login.html");
  showLoggedInInitials();
}
