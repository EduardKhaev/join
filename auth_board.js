function accessPage() {
  hasAccess = checkAuthState();
  if (hasAccess) {
    document.getElementById("body").style = "";
    document.onload = initBoard();
  } else window.location.replace("./login.html");
}
