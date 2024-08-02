const FIREBASE_URL =
  "https://join-e8e95-default-rtdb.europe-west1.firebasedatabase.app/";

let users = [];
let dataSet = [];

let activeUser = undefined;

async function init() {
  await loadUsers();
  sortAllUsers();
  displayUsers();
}

/*

function pushDatasets() {
  for (let i = 0; i < dataSet.length; i++) {
    postData("/names", dataSet[i]);
  }
}
  */

async function loadUsers(path = "/names") {
  let userResponse = await fetch(FIREBASE_URL + path + ".json");
  let responseToJson = await userResponse.json();
  if (responseToJson) {
    Object.keys(responseToJson).forEach((key) => {
      users.push({
        id: key,
        name: responseToJson[key]["name"],
        phone: responseToJson[key]["phone"],
        email: responseToJson[key]["email"],
        color: responseToJson[key]["color"],
        initials: responseToJson[key]["initials"],
      });
    });
  }
}

function sortAllUsers() {
  users.sort((a, b) => a.name.localeCompare(b.name));
}

function displayUsers() {
  // show all users in list / Max
  let contacts = document.getElementById("contact-list");
  contacts.innerHTML = "";
  let currentLetter = "";
  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    let name = user.name;
    let email = user.email;
    let color = user.color;
    let initials = user.initials;

    if (firstletter(i) != currentLetter) {
      contacts.innerHTML += `
            <div class="letter-alph">
              <span>${firstletter(i)}</span>
            </div>
            <div class="separator-contacts"></div>
            `;
      currentLetter = firstletter(i);
    }
    contacts.innerHTML += `<div id="single-contact" class="single-contact sc-color" onclick="showUserDetails(${i}, this)" >
              <div class="cl-avatar" style = "background-color: ${color};">
                <div class="cl-overlay-text">${initials}</div>
              </div>
              <div class="single-contact-details">
                <span>${name}</span>
                <a href="">${email}</a>
              </div>
            </div>`;
  }
}

function firstletter(index) {
  let firstLetter = users[index].name.charAt(0);
  return firstLetter;
} // Max

function showUserDetails(index, element) {
  setUserActive(element);
  let user = users[index];
  let fullContactDetails = document.getElementById("full-contact-details");
  fullContactDetails.innerHTML = ` 
    <div class="full-contact-text">
      <div class="ci-head">
        <div class="ci-avatar" style="background-color: ${user.color};">
          <div class="ci-overlay-text">${user.initials}</div>
        </div>
        <div class="ci-elements">
          <div class="ci-name">${user.name}</div>
          <div class="ci-actions">
            <div class="ci-actions-item">
              <img src="./icons/edit.svg" alt="edit icon" />
              <div>Edit</div>
            </div>
            <div class="ci-actions-item">
              <img src="./icons/delete.svg" alt="delete icon" />
              <div>Delete</div>
            </div>
          </div>
        </div>
      </div>
      <div class="ci-text">Contact Information</div>
      <div class="info-block">
        <div class="ci-info-text">Email</div>
        <div class="ci-mailaddress">${user.email}</div>
        <div class="ci-info-text">Phone</div>
        <div>${user.phone}</div>
      </div>
    </div>
  `;
}

function setUserActive(element) {
  if (activeUser) {
    activeUser.style.backgroundColor = "";
    activeUser.style.color = "";
    activeUser.classList.add("sc-color");
  }
  activeUser = element;
  activeUser.classList.remove("sc-color");
  activeUser.style.backgroundColor = "#2b3548";
  activeUser.style.color = "white";
}

function addNewUser() {
  let nameInput = document.getElementById('inputname').value;
  let mailInput = document.getElementById('inputemail').value;
  let phoneInput = document.getElementById('inputphone').value;

  let initials = getInitials(nameInput);

  let newUser = {
    name: nameInput,
    email: mailInput,
    phone: phoneInput,
    color: 'red'

    
  };
  postData("/names", newUser);
  
  };
  function getInitials(name) {
    let initials = '';
  }

 // Eduard

function editUser(index) {}

// function deleteUser(index) {}

async function addUser() {
  let nameValue = document.getElementById("name").value;
  let phoneValue = document.getElementById("phone").value;
  let newUser = { name: nameValue, phone: phoneValue };
  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  await postData("/names", newUser);
  await loadUsers("/names");
}

async function postData(path = "/names", data = dataSet) {
  await fetch(FIREBASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
