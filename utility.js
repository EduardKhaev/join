/**
 * displays feedback message after an action
 * @param {string} message - message to display
 */
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

/**
 * creates an overlay modal
 * @param {int} id - id of overlay HTMLElement
 * @param {string} overlayclass - class of overlay HTMLElement
 * @returns
 */
function createOverlay(id, overlayclass = "overlay") {
  let parent = document.getElementById("body");
  let overlay = elementBuilder(parent, "div", overlayclass, id);
  return overlay;
}

/**
 *
 * @param {HTMLElement} parent - parent Element to create a bew HTMLElement in
 * @param {string} childType - HTMLElement type
 * @param {string} childClass - class of created HTMLElement
 * @param {string} childID - id of created HTMLElement
 * @returns
 */
function elementBuilder(parent, childType, childClass, childID = "") {
  let child = document.createElement(childType);
  child.className = childClass;
  child.id = childID;
  parent.appendChild(child);
  return child;
}

/**
 * creates a random color in hex format
 */
function getRandomColor() {
  let color = "";
  let hue = getRandomInt(360);
  let saturation = getRandomInt(30) + 70;
  color = hslToHex(hue, saturation, 50);
  return color;
}

/**
 * generates a random integer number
 * @param {int} max
 * @returns random int between 0 and [max]
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

/**
 * converts a color definition in hsl to hex
 * @param {int} h - hue (0 to 360)
 * @param {int} s - saturation (0 to 100)
 * @param {int} l - lightness (0 to 100)
 * @returns color {string} in hex value
 */
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

function getTodaysDate() {
  let date = new Date();
  let year = date.getFullYear().toString();
  let month = date.getMonth() + 1;
  month < 10 ? (month = "0" + month.toString()) : (month = month.toString());
  let day = date.getDate();
  day < 10 ? (day = "0" + day.toString()) : (day = day.toString());
  let yyyymmdd = `${year}-${month}-${day}`;
  return yyyymmdd;
}

function sortByDate(a, b) {
  if (a.date < b.date) {
    return -1;
  }
  if (a.date > b.date) {
    return 1;
  }
  return 0;
}
