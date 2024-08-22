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
