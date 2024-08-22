/**
 * check if user is logged in
 */
function accessPage() {
  hasAccess = checkAuthState();
  if (hasAccess) {
    document.getElementById("sidebar").style = "";
  }
  showLoggedInInitials();
}
