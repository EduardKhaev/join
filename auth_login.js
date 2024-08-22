/**
 * check if user is logged in
 */
function accessPage() {
  hasAccess = checkAuthState();
  if (hasAccess) {
    window.location.replace("./summary.html");
  }
}
