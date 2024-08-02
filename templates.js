function returnContactListItems(i, user) {
  return `
            <div id="single-contact" class="single-contact sc-color" onclick="showUserDetails(${i}, this)" >
              <div class="cl-avatar" style = "background-color: ${user.color};">
                <div class="cl-overlay-text">${user.initials}</div>
              </div>
              <div class="single-contact-details">
                <span>${user.name}</span>
             <div class="ci-mailaddress max-mail-length">${user.email}</div>
              </div>
            </div>`;
}

function returnUserDetails(user) {
  return ` 
    <div class="full-contact-text">
      <div class="ci-head">
        <div class="ci-avatar" style="background-color: ${user.color};">
          <div class="ci-overlay-text">${user.initials}</div>
        </div>
        <div class="ci-elements">
          <div class="ci-name">${user.name}</div>
          <div class="ci-actions">
            <div class="ci-actions-item" onclick="renderEditUserInputField('${user.id}')">
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

function getAddUserInputHtml() {
    return `
    <section class="adduser-maincontainer">
      <div class="adduser-brandcontainer">
        <div class="adduser-brandarea">
          <img class="adduser-brandlogo" src="img/join-logo.png" alt="" />
          <div class="adduser-brandtext">
            <h1 class="adduser-h1">Add contact</h1>
            <span class="adduser-span">Tasks are better with a team!</span>
            <div class="adduser-brandline"></div>
          </div>
        </div>
      </div>
      <div class="adduser-logincontainer">
        <div class="adduser-loginprofile">
          <img src="img/profile-icon.png" alt="" />
        </div>
        <form onsubmit="addNewUser(event)">
          <div class="adduser-logininputs">
            <input
              required
              id="inputname"
              class="inputtextname"
              type="text"
              placeholder="Name"
            />
            <input
              required
              id="inputemail"
              class="inputtextemail"
              type="email"
              placeholder="Email"
            />
            <input
              required
              id="inputphone"
              class="inputtextphone"
              type="text"
              placeholder="Phone"
            />
            <div class="adduser-buttons">
              <button class="adduser-cancelbutton button-secondary">
                Cancel <img src="img/close.png" alt="" />
              </button>
              <button
                type="submit"
                id="adduser-AddContact"
                class="adduser-addcontactbutton button-primary"
              >
                Create contact <img src="img/check.png" alt="" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
    `;
  }