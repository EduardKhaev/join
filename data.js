const defaultTask = {
  id: false,
  title: false,
  description: "",
  assigned: false,
  date: false,
  priority: "medium",
  category: false,
  subtasks: [],
  taskState: "to do",
};

const FIREBASE_URL =
  "https://join-e8e95-default-rtdb.europe-west1.firebasedatabase.app/";

let users = [];
let activeUser = undefined;
let activeNavItem = undefined;
let selectedUrgency = "medium";
let tasks = [];
let groupedTasks = {};
let currentDraggedTask;

let loggedIn = {
  name: "",
  initials: "",
};
