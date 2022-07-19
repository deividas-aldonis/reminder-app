const createForm = document.getElementById("create-form");
const createNoteTitle = document.getElementById("create-title");
const createNoteDescription = document.getElementById("create-description");
const createDatePicker = document.getElementById("create-date-picker");

const updateForm = document.getElementById("update-form");
const updateTitle = document.getElementById("update-title");
const updateDescription = document.getElementById("update-description");
const updateDatePicker = document.getElementById("update-date-picker");

const addNewNoteBtns = document.querySelectorAll(`[data-name="add-new-note-button"]`);
const removeBtns = document.querySelectorAll(`[data-name="remove-button"]`);
const updateBtns = document.querySelectorAll(`[data-name="update-button"]`);

const menu = document.getElementById("menu");
const menuOpenBtn = document.getElementById("menu-open-button");
const closeMenuBtn = document.getElementById("close-menu-button");
const searchForms = document.querySelectorAll(`[data-name="search-form"]`);

// CLEAR VALUES
createNoteTitle.value = "";
createNoteDescription.value = "";
createDatePicker.value = "";
updateDatePicker.value = "";

// Global var to store date picked from flatpickr
let datePicked = "";

// EVENT LISTENERS
window.onresize = closeMenuIfOpen;
document.onclick = checkIfModalOpen;

createForm.onsubmit = createNote;
updateForm.onsubmit = updateNote;

addNewNoteBtns.forEach((btn) => (btn.onclick = openModal));
removeBtns.forEach((btn) => (btn.onclick = deleteNote));
updateBtns.forEach((btn) => (btn.onclick = fillNoteForm));

menuOpenBtn.onclick = openMenu;
closeMenuBtn.onclick = closeMenu;

searchForms.forEach((form) => (form.onsubmit = submitSearchForm));


function fetchOptions(method, data) {
  return {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
}
// CREATE
async function createNote(e) {
  e.preventDefault();

  const data = {
    title: createNoteTitle.value,
    description: createNoteDescription.value,
    date: datePicked,
  };

  const res = await fetch("/notes", fetchOptions("POST", data));
  if (res.status === 200) location.href = location.pathname;
}
// REMOVE
async function deleteNote(e) {
  const id = e.target.closest("[data-id]").dataset.id;

  const res = await fetch(`/notes/${id}`, { method: "DELETE" });
  if (res.status === 200) location.href = location.pathname;
}
// UPDATE
async function updateNote(e) {
  e.preventDefault();
  const data = {
    title: updateTitle.value,
    description: updateDescription.value,
    date: datePicked,
  };
  const id = updateForm.dataset.updateId;

  const res = await fetch(`/notes/${id}`, fetchOptions("PUT", data));
  if (res.status === 200) location.href = location.pathname;
}
// FILL FORM UPON CLICKING UPDATE ICON
function fillNoteForm(e) {
  const mainEl = e.target.closest(`[data-id]`);
  const title = mainEl.querySelector(`[data-name="title"]`);
  const description = mainEl.querySelector(`[data-name="description"]`);

  updateTitle.value = title.innerText;
  updateDescription.value = description.innerText;

  updateForm.setAttribute("data-update-id", mainEl.dataset.id);
  updateForm.classList.replace("hidden", "flex");
}
// OPEN MODAL
function openModal() {
  if (menu.classList.contains("show")) {
    menu.classList.remove("show");
  }
  createForm.classList.replace("hidden", "flex");
}
// CLOSE MODAL IF OPEN
function checkIfModalOpen(e) {
  if (
    e.target === createForm ||
    (e.target === updateForm && e.target.classList.contains("flex"))
  ) {
    e.target.classList.replace("flex", "hidden");
  }
}
// OPEN MENU
function openMenu() {
  menu.classList.toggle("show");
}
// CLOSE MENU
function closeMenu() {
  menu.classList.remove("show");
}
// CLOSE MENU IF OPEN
function closeMenuIfOpen() {
  if (window.innerWidth >= 976 && menu.classList.contains("show")) {
    menu.classList.remove("show");
  }
}
// SUBMIT FORM
function submitSearchForm(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const { search } = Object.fromEntries(formData);

  search ? (window.location.href = `/search?q=${search}`) : null;
}
// FLATPICKR
const flatPickrOptions = {
  minDate: new Date(Date.now() + 60000 * 1),
  plugins: [new confirmDatePlugin({})],
  enableTime: true,
  time_24hr: true,
  onOpen: function (selectedDates, dateStr, instance) {
    instance.set("minDate", new Date(Date.now() + 60000 * 1));
  },
  onClose: function (selectedDates, dateStr, instance) {
    datePicked = selectedDates[0];
  },
};
const fpCreate = flatpickr("#create-date-picker", flatPickrOptions);
const fpUpdate = flatpickr("#update-date-picker", flatPickrOptions);
