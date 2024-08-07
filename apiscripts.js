async function putData(path = "/names/", id, data) {
  await fetch(FIREBASE_URL + path + id + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

async function postData(path = "/names", data) {
  await fetch(FIREBASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

async function deleteData(path = "/names/", id) {
  await fetch(FIREBASE_URL + path + id + ".json", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
