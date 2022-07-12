const createBtn = document.getElementById("create-button");

const searchBtn = document.querySelector(".search-btn");
const searchBox = document.querySelector(".search-box");
searchBtn.onclick = () => searchBox.classList.toggle("open");

// TODO: Form validation;

let date = ""; // Global var for flatpickr to store date str

const sendData = async (data) => {
  console.log(data);
  await fetch("/test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

createBtn.onclick = () => {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const data = {
    title,
    description,
    date,
  };
  sendData(data);
};

function calcMinTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 15);
  let h = now.getHours() + "";
  let m = now.getMinutes() + "";

  if (m.length === 1) m = m.padStart(2, "0");
  if (h.length === 1) h = h.padStart(2, "0");
  const time = `${h}:${m}`;
  return time;
}

const fp = flatpickr("#date-picker", {
  minDate: "today",
  plugins: [new confirmDatePlugin({})],
  enableTime: true,
  time_24hr: true,
  minTime: calcMinTime(),
  onClose: function (selectedDates, dateStr, instance) {
    date = dateStr;
  },
});
