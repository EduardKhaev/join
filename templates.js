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

function returnUserDetails(index, user) {
  return ` 
    <div class="full-contact-text">
      <div class="ci-head">
        <div class="ci-avatar" style="background-color: ${user.color};">
          <div class="ci-overlay-text">${user.initials}</div>
        </div>
        <div class="ci-elements">
          <div class="ci-name">${user.name}</div>
          <div class="ci-actions">
            <div class="ci-actions-item" onclick="renderEditUserInputField(${index})">
              <svg fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 17H3.4L12.025 8.375L10.625 6.975L2 15.6V17ZM16.3 6.925L12.05 2.725L13.45 1.325C13.8333 0.941667 14.3042 0.75 14.8625 0.75C15.4208 0.75 15.8917 0.941667 16.275 1.325L17.675 2.725C18.0583 3.10833 18.2583 3.57083 18.275 4.1125C18.2917 4.65417 18.1083 5.11667 17.725 5.5L16.3 6.925ZM14.85 8.4L4.25 19H0V14.75L10.6 4.15L14.85 8.4Z" fill="#2A3647"/>
              </svg>
              <div>Edit</div>
            </div>
            <div class="ci-actions-item" onclick="deleteUser('${user.id}')">
              <svg fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z" fill="#2A3647"/>
              </svg>
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

function returnEditUserChoice(index) {
  return `
  <div class="choice-container" id="choice-container">
            <div class="ci-actions-item-responsive" onclick="renderEditUserInputField(${index})">
              <svg fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 17H3.4L12.025 8.375L10.625 6.975L2 15.6V17ZM16.3 6.925L12.05 2.725L13.45 1.325C13.8333 0.941667 14.3042 0.75 14.8625 0.75C15.4208 0.75 15.8917 0.941667 16.275 1.325L17.675 2.725C18.0583 3.10833 18.2583 3.57083 18.275 4.1125C18.2917 4.65417 18.1083 5.11667 17.725 5.5L16.3 6.925ZM14.85 8.4L4.25 19H0V14.75L10.6 4.15L14.85 8.4Z" fill="#2A3647"/>
              </svg>
              <div>Edit</div>
            </div>
            <div class="ci-actions-item-responsive" onclick="deleteUser('${users[index].id}')">
              <svg fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z" fill="#2A3647"/>
              </svg>
              <div>Delete</div>
            </div>
  </div>`;
}

function returnUserDetailsSmall(index, user) {
  return ` 
  <div class="small-details-container">
    <svg onclick="closeUserDetails()" width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.0097 17.8855H30.1871C31.0362 17.8855 31.7246 18.5739 31.7246 19.4231C31.7246 20.2722 31.0362 20.9606 30.1871 20.9606H13.0097L20.17 28.1209C20.7704 28.7213 20.7704 29.6946 20.17 30.295C19.5697 30.8954 18.5963 30.8954 17.996 30.295L8.53824 20.8373C7.75719 20.0562 7.75719 18.7899 8.53824 18.0089L17.996 8.55115C18.5963 7.9508 19.5697 7.9508 20.17 8.55115C20.7704 9.1515 20.7704 10.1249 20.17 10.7252L13.0097 17.8855Z" fill="#29ABE2"/>
    </svg>
    <div class="contacts-headline">
        <h1>Contacts</h1>
        <span>Better with a team</span>
        <div class="spacer"></div>
     </div>  
     <div class="small-contact-text">
      <div class="small-ci-head">
        <div class="ci-avatar" style="background-color: ${user.color};">
          <div class="ci-overlay-text">${user.initials}</div>
        </div>
        <div class="ci-elements">
          <div class="ci-name">${user.name}</div>
          <div class="ci-actions">
            <div class="ci-actions-item" onclick="renderEditUserInputField(${index})">
              <svg fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 17H3.4L12.025 8.375L10.625 6.975L2 15.6V17ZM16.3 6.925L12.05 2.725L13.45 1.325C13.8333 0.941667 14.3042 0.75 14.8625 0.75C15.4208 0.75 15.8917 0.941667 16.275 1.325L17.675 2.725C18.0583 3.10833 18.2583 3.57083 18.275 4.1125C18.2917 4.65417 18.1083 5.11667 17.725 5.5L16.3 6.925ZM14.85 8.4L4.25 19H0V14.75L10.6 4.15L14.85 8.4Z" fill="#2A3647"/>
              </svg>
              <div>Edit</div>
            </div>
            <div class="ci-actions-item" onclick="deleteUser('${user.id}')">
              <svg fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z" fill="#2A3647"/>
              </svg>
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
  </div>
  `;
}

function getAddUserInputHtml() {
  return `
    <section id="adduser-maincontainer" class="adduser-maincontainer">
      
      <div class="adduser-brandcontainer">
      <svg onclick="cancelAddUser()" width="32" height="32" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.9998 8.40005L2.0998 13.3C1.91647 13.4834 1.68314 13.575 1.3998 13.575C1.11647 13.575 0.883138 13.4834 0.699805 13.3C0.516471 13.1167 0.424805 12.8834 0.424805 12.6C0.424805 12.3167 0.516471 12.0834 0.699805 11.9L5.5998 7.00005L0.699805 2.10005C0.516471 1.91672 0.424805 1.68338 0.424805 1.40005C0.424805 1.11672 0.516471 0.883382 0.699805 0.700049C0.883138 0.516715 1.11647 0.425049 1.3998 0.425049C1.68314 0.425049 1.91647 0.516715 2.0998 0.700049L6.9998 5.60005L11.8998 0.700049C12.0831 0.516715 12.3165 0.425049 12.5998 0.425049C12.8831 0.425049 13.1165 0.516715 13.2998 0.700049C13.4831 0.883382 13.5748 1.11672 13.5748 1.40005C13.5748 1.68338 13.4831 1.91672 13.2998 2.10005L8.3998 7.00005L13.2998 11.9C13.4831 12.0834 13.5748 12.3167 13.5748 12.6C13.5748 12.8834 13.4831 13.1167 13.2998 13.3C13.1165 13.4834 12.8831 13.575 12.5998 13.575C12.3165 13.575 12.0831 13.4834 11.8998 13.3L6.9998 8.40005Z" fill="white"/>
      </svg>
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
        <div class="adduser-overlay-close">
          <img class="adduser-close-button" src="img/close.png" alt="" onclick="cancelAddUser()" return false;>
        </div>
        <form onsubmit="addNewUser(event)">
          <div class="adduser-logininputs">
            <input
              required
              oninvalid="event.preventDefault(); showInvalid(this)"
              onfocus="removeInvalid(this)"
              id="inputname"
              class="inputtextname"
              type="text"
              placeholder="Name"
            />
            <input
              required
              oninvalid="event.preventDefault(); showInvalid(this)"
              onfocus="removeInvalid(this)"
              id="inputemail"
              class="inputtextemail"
              type="email"
              placeholder="Email"
            />
            <input
              required
              oninvalid="event.preventDefault(); showInvalid(this)"
              onfocus="removeInvalid(this)"
              id="inputphone"
              class="inputtextphone"
              type="tel"
              pattern="^[0-9\ \+]{3,40}$"
              placeholder="Phone"
            />
            <div class="adduser-buttons">
              <div class="button-secondary btn-with-icon" onclick="cancelAddUser()" return false;>
                Cancel <img src="img/close.png" alt="" />
              </div>
              <button
                type="submit"
                id="adduser-AddContact"
                class="button-primary action-button-text"
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

function getUserEditHtml(user) {
  return `
    <section id="adduser-maincontainer" class="adduser-maincontainer">
       
      <div class="adduser-brandcontainer">
        <svg onclick="cancelAddUser()" width="32" height="32" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.9998 8.40005L2.0998 13.3C1.91647 13.4834 1.68314 13.575 1.3998 13.575C1.11647 13.575 0.883138 13.4834 0.699805 13.3C0.516471 13.1167 0.424805 12.8834 0.424805 12.6C0.424805 12.3167 0.516471 12.0834 0.699805 11.9L5.5998 7.00005L0.699805 2.10005C0.516471 1.91672 0.424805 1.68338 0.424805 1.40005C0.424805 1.11672 0.516471 0.883382 0.699805 0.700049C0.883138 0.516715 1.11647 0.425049 1.3998 0.425049C1.68314 0.425049 1.91647 0.516715 2.0998 0.700049L6.9998 5.60005L11.8998 0.700049C12.0831 0.516715 12.3165 0.425049 12.5998 0.425049C12.8831 0.425049 13.1165 0.516715 13.2998 0.700049C13.4831 0.883382 13.5748 1.11672 13.5748 1.40005C13.5748 1.68338 13.4831 1.91672 13.2998 2.10005L8.3998 7.00005L13.2998 11.9C13.4831 12.0834 13.5748 12.3167 13.5748 12.6C13.5748 12.8834 13.4831 13.1167 13.2998 13.3C13.1165 13.4834 12.8831 13.575 12.5998 13.575C12.3165 13.575 12.0831 13.4834 11.8998 13.3L6.9998 8.40005Z" fill="white"/>
      </svg> 
        <div class="adduser-brandarea">
          <img class="adduser-brandlogo" src="img/join-logo.png" alt="" />
          <div class="adduser-brandtext">
            <h1 class="adduser-h1">Edit contact</h1>

            <div class="adduser-brandline"></div>
          </div>
        </div>
      </div>
      <div class="adduser-logincontainer">
        <div class="adduser-loginprofile">
          <div class="ci-avatar" style="background-color: ${user.color};">
          <div class="ci-overlay-text">${user.initials}</div>
        </div>
        </div>
        <div class="adduser-overlay-close">
          <img class="adduser-close-button" src="img/close.png" alt="" onclick="cancelAddUser()" return false;>
        </div>
        <form onsubmit="addEditedUser(event, '${user.id}', true)">
          <div class="adduser-logininputs">
            <input
              required
              oninvalid="event.preventDefault()"
              id="inputname"
              class="inputtextname"
              type="text"
              placeholder="Name"
              value="${user.name}"
            />
            <input
              required
              oninvalid="event.preventDefault()"
              id="inputemail"
              class="inputtextemail"
              type="email"
              placeholder="Email"
              value="${user.email}"
            />
            <input
              required
              oninvalid="event.preventDefault()"
              id="inputphone"
              class="inputtextphone"
              type="tel"
              pattern="^[0-9\ \+]{3,40}$"
              placeholder="Phone"
              value="${user.phone}"
            />
            <div class="adduser-buttons">
              <button class="button-secondary btn-with-icon" onclick="addEditedUser(event, '${user.id}', false)">Delete</button>
              <button
                type="submit"
                id="adduser-AddContact"
                class="action-button-text button-primary"
              >
                Save <img src="img/check.png" alt="" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
    `;
}

function renderConfirmationModal(userId) {
  return `
    <div class="confirmation-modal" id="confirmation-modal">
      <div class="modal-text">
        <div class="warning-text">Delete Contact?</div>
        <div class="modal-buttons">
          <button class="button-secondary" onclick="cancelDelete()">
            Cancel <img src="img/close.png" alt="" /></button
          ><button class="button-primary delete-button" onclick="confirmDelete('${userId}')">
            Delete Contact<svg fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z"
                fill="#2A3647"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>`;
}

function renderContactDropdown(user) {
  return `
                    <li onclick="markContactAssigned('${user.id}')">
                      <div class="task-avatar cl-avatar-space" style = "background-color: ${user.color};">${user.initials}</div>
                      <span class="assigned-person">${user.name}</span>
                      <input
                        type="checkbox"
                        id="${user.id}"
                        name="assignedTo"
                        class="custom-checkbox assigned-user"
                      />
                      <label for="${user.id}"" class="custom-checkbox-label">
                        <div class="checkbox-icon">
                          <svg
                            width="19"
                            height="18"
                            viewBox="0 0 19 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              class="unchecked"
                              x="1.38818"
                              y="1"
                              width="16"
                              height="16"
                              rx="3"
                              stroke="#2A3647"
                              stroke-width="2"
                            />
                            <path
                              class="checked"
                              d="M17.3882 8V14C17.3882 15.6569 16.045 17 14.3882 17H4.38818C2.73133 17 1.38818 15.6569 1.38818 14V4C1.38818 2.34315 2.73133 1 4.38818 1H12.3882"
                              stroke="#2A3647"
                              stroke-width="2"
                              stroke-linecap="round"
                            />
                            <path
                              class="checked"
                              d="M5.38818 9L9.38818 13L17.3882 1.5"
                              stroke="#2A3647"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>
                      </label>
                    </li>
    
    `;
}

function addSubtaskHTML(subtaskValue){
  return `
      <li> 
        <textarea class="subtask-input" onchange="updateSubtask(event)">${subtaskValue}</textarea>
        <div class="subtask-icons">
          <svg class="edit-svg" onclick="editSubtask(event)" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 17H3.4L12.025 8.375L10.625 6.975L2 15.6V17ZM16.3 6.925L12.05 2.725L13.45 1.325C13.8333 0.941667 14.3042 0.75 14.8625 0.75C15.4208 0.75 15.8917 0.941667 16.275 1.325L17.675 2.725C18.0583 3.10833 18.2583 3.57083 18.275 4.1125C18.2917 4.65417 18.1083 5.11667 17.725 5.5L16.3 6.925ZM14.85 8.4L4.25 19H0V14.75L10.6 4.15L14.85 8.4Z" fill="#2A3647"/>
          </svg>
          <hr>
          <svg class="delete-svg" onclick="deleteSubtask(event)" width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.14453 18C2.59453 18 2.1237 17.8042 1.73203 17.4125C1.34036 17.0208 1.14453 16.55 1.14453 16V3C0.861198 3 0.623698 2.90417 0.432031 2.7125C0.240365 2.52083 0.144531 2.28333 0.144531 2C0.144531 1.71667 0.240365 1.47917 0.432031 1.2875C0.623698 1.09583 0.861198 1 1.14453 1H5.14453C5.14453 0.716667 5.24036 0.479167 5.43203 0.2875C5.6237 0.0958333 5.8612 0 6.14453 0H10.1445C10.4279 0 10.6654 0.0958333 10.857 0.2875C11.0487 0.479167 11.1445 0.716667 11.1445 1H15.1445C15.4279 1 15.6654 1.09583 15.857 1.2875C16.0487 1.47917 16.1445 1.71667 16.1445 2C16.1445 2.28333 16.0487 2.52083 15.857 2.7125C15.6654 2.90417 15.4279 3 15.1445 3V16C15.1445 16.55 14.9487 17.0208 14.557 17.4125C14.1654 17.8042 13.6945 18 13.1445 18H3.14453ZM3.14453 3V16H13.1445V3H3.14453ZM5.14453 13C5.14453 13.2833 5.24036 13.5208 5.43203 13.7125C5.6237 13.9042 5.8612 14 6.14453 14C6.42786 14 6.66536 13.9042 6.85703 13.7125C7.0487 13.5208 7.14453 13.2833 7.14453 13V6C7.14453 5.71667 7.0487 5.47917 6.85703 5.2875C6.66536 5.09583 6.42786 5 6.14453 5C5.8612 5 5.6237 5.09583 5.43203 5.2875C5.24036 5.47917 5.14453 5.71667 5.14453 6V13ZM9.14453 13C9.14453 13.2833 9.24037 13.5208 9.43203 13.7125C9.6237 13.9042 9.8612 14 10.1445 14C10.4279 14 10.6654 13.9042 10.857 13.7125C11.0487 13.5208 11.1445 13.2833 11.1445 13V6C11.1445 5.71667 11.0487 5.47917 10.857 5.2875C10.6654 5.09583 10.4279 5 10.1445 5C9.8612 5 9.6237 5.09583 9.43203 5.2875C9.24037 5.47917 9.14453 5.71667 9.14453 6V13Z" fill="#2A3647"/>
          </svg>
        </div>
      </li>`;
}