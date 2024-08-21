function accessPage() {
  hasAccess = checkAuthState();
  if (hasAccess) {
    document.getElementById("body").style = "";
    document.onload = initTask();
  } else window.location.replace("./login.html");
}
