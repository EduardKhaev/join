function returnContactListItems(i, user) {
  return `
            <div id="single-contact" class="single-contact sc-color" onclick="showUserDetails(${i}, this)" >
              <div class="cl-avatar" style = "background-color: ${user.color};">
                <div class="cl-overlay-text">${user.initials}</div>
              </div>
              <div class="single-contact-details">
                <span>${user.name}</span>
                <a href="">${user.email}</a>
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
