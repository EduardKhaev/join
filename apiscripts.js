/**
 * send an edit contact to database to replace the existing contact
 * @param {string} path - the path in the database where the contact should be updated
 * @param {string} id - the unique identifier for the contact being updated
 * @param {object} data - the contact that will replace the existing contact 
 */
async function putData(path = "/names/", id, data) {
  await fetch(FIREBASE_URL + path + id + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * send a new contact to database
 * @param {string} path - path in the database where the contact should be added
 * @param {object} data - added contacts
 */
async function postData(path = "/names", data) {
  await fetch(FIREBASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * delete the contact from database
 * @param {string} path - path in the database where the contact should be deleted
 * @param {string} id - the unique identifier for the contact to be deleted
 */
async function deleteData(path = "/names/", id) {
  await fetch(FIREBASE_URL + path + id + ".json", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
