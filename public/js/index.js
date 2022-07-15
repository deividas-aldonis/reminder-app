const addNewNoteBtn = document.getElementById("add-new-note");
const createNoteBtn = document.getElementById("create-button");
const createNoteTitle = document.getElementById("create-title");
const createNoteDescription = document.getElementById("create-description");
const updateNoteBtn = document.getElementById("update-button");
const updateTitle = document.getElementById("update-title");
const updateDescription = document.getElementById("update-description");
const createDatePicker = document.getElementById("create-date-picker");
const updateDatePicker = document.getElementById("update-date-picker");
const createModal = document.getElementById("create-modal");
const updateModal = document.getElementById("update-modal");

const removeBtns = document.querySelectorAll(".remove-button");
const updateBtns = document.querySelectorAll(".update-button");

const menuOpenBtn = document.getElementById("menu-open-btn");
const menu = document.getElementById("menu");
// TODO: Form validation;

// FIX MENU
// OPENED MENU DOESNT CLOSE ON WINDOW RESIZE

// CLEAR VALUES
createNoteTitle.value = "";
createNoteDescription.value = "";
createDatePicker.value = "";
updateDatePicker.value = "";

// Global var to store date picked from flatpickr
let datePicked = "";

// EVENT LISTENERS
document.onclick = checkIfModalOpen;
menuOpenBtn.onclick = openMenu;

addNewNoteBtn.onclick = openModal;

createNoteBtn.onclick = createNote;
updateNoteBtn.onclick = updateNote;
removeBtns.forEach((btn) => (btn.onclick = deleteNote));
updateBtns.forEach((btn) => (btn.onclick = fillNoteForm));

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
async function createNote() {
  const data = {
    title: createNoteTitle.value,
    description: createNoteDescription.value,
    date: datePicked,
  };

  const res = await fetch("/notes", fetchOptions("POST", data));
  if (res.status === 200) location.reload();
}
// REMOVE
async function deleteNote(e) {
  const id = e.target.closest("[data-id]").dataset.id;

  const res = await fetch(`/notes/${id}`, { method: "DELETE" });
  if (res.status === 200) location.reload();
}
// UPDATE
async function updateNote() {
  const data = {
    title: updateTitle.value,
    description: updateDescription.value,
    date: datePicked,
  };
  const id = updateModal.dataset.updateId;

  const res = await fetch(`/notes/${id}`, fetchOptions("PUT", data));
  if (res.status === 200) location.reload();
}
// FILL FORM UPON CLICKING UPDATE ICON
function fillNoteForm(e) {
  const mainEl = e.target.closest(`[data-id]`);
  const title = mainEl.querySelector(`[data-name="title"]`);
  const description = mainEl.querySelector(`[data-name="description"]`);

  updateTitle.value = title.textContent;
  updateDescription.value = description.textContent;

  updateModal.setAttribute("data-update-id", mainEl.dataset.id);
  updateModal.classList.replace("hidden", "flex");
}
// OPEN MODAL
function openModal() {
  createModal.classList.replace("hidden", "flex");
}
// CLOSE MODAL IF OPEN
function checkIfModalOpen(e) {
  if (
    e.target === createModal ||
    (e.target === updateModal && e.target.classList.contains("flex"))
  ) {
    e.target.classList.replace("flex", "hidden");
  }
}
// TOGGLE SEARCH
function openMenu(e) {
  menu.classList.toggle("show");
}
// FLATPICKR
const flatPickrOptions = {
  minDate: new Date(Date.now() + 60000 * 2),
  plugins: [new confirmDatePlugin({})],
  enableTime: true,
  time_24hr: true,
  onOpen: function (selectedDates, dateStr, instance) {
    instance.set("minDate", new Date(Date.now() + 60000 * 2));
  },
  onClose: function (selectedDates, dateStr, instance) {
    datePicked = selectedDates[0];
  },
};
const fpCreate = flatpickr("#create-date-picker", flatPickrOptions);
const fpUpdate = flatpickr("#update-date-picker", flatPickrOptions);
