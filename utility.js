function showChangeSuccess(message) {
  let parent = document.getElementById("body");
  let messagePopUp = elementBuilder(parent, "div", "display-message");
  messagePopUp.innerHTML = message;
  messagePopUp.style.opacity = "0";
  messagePopUp.style.opacity = "1";
  setTimeout(() => {
    messagePopUp.style.opacity = "0";
  }, 2000);
  setTimeout(() => {
    messagePopUp.remove();
  }, 2300);
}

function createOverlay(id, overlayclass = "overlay") {
  let parent = document.getElementById("body");
  let overlay = elementBuilder(parent, "div", overlayclass, id);
  return overlay;
}

function elementBuilder(parent, childType, childClass, childID = "") {
  let child = document.createElement(childType);
  child.className = childClass;
  child.id = childID;
  parent.appendChild(child);
  return child;
}

function getRandomColor() {
  let color = "";
  let hue = getRandomInt(255);
  let saturation = getRandomInt(30) + 70;
  color = hslToHex(hue, saturation, 50);
  return color;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
