const searchBtn = document.querySelector(".search-btn");
const searchBox = document.querySelector(".search-box");
searchBtn.onclick = () => searchBox.classList.toggle("open");
const addNewBtn = document.getElementById("add-new-note");
const createBtn = document.getElementById("create-button");
const title = document.getElementById("title");
const description = document.getElementById("description");
const datePicker = document.getElementById("date-picker");
const modal = document.getElementById("modal");

const removeBtns = document.querySelectorAll("#remove-button");
title.value = "";
description.value = "";
datePicker.value = "";

// TODO: Form validation;

let tempDate = ""; // Global var for flatpickr to store date str

const sendData = async (data) => {
  console.log(JSON.stringify(data));
  const res = await fetch("/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  // if (res.status === 200) window.location.reload();
};

createBtn.onclick = () => {
  const data = {
    title: title.value,
    description: description.value,
    date: tempDate,
  };
  sendData(data);
};

// check date with onchange

const fp = flatpickr("#date-picker", {
  minDate: new Date(Date.now() + 60000 * 2),
  plugins: [new confirmDatePlugin({})],
  enableTime: true,
  time_24hr: true,
  onOpen: function (first, date, instance) {
    instance.set("minDate", new Date(Date.now() + 60000 * 2));
  },
  onClose: function (selectedDates, dateStr, instance) {
    tempDate = selectedDates[0];
  },
});

// flatpickr over

addNewBtn.onclick = () => {
  modal.classList.replace("hidden", "flex");
};

document.addEventListener("click", (e) => {
  if (e.target === modal && e.target.classList.contains("flex")) {
    e.target.classList.replace("flex", "hidden");
  }
});

// remove

const deleteNote = async (id) => {
  const res = await fetch(`/notes/${id}`, {
    method: "DELETE",
  });
  if (res.status === 200) window.location.reload();
};

removeBtns.forEach((btn) => {
  btn.onclick = (e) => {
    const noteId = e.target.closest("[data-id]").dataset.id;
    deleteNote(noteId);
  };
});
