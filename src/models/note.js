const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    completed: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.pre("save", async function (next) {
  const user = this;

  const d = new Date(user.date);
  const year = d.getFullYear().toString();
  const month = (d.getMonth() + 1).toString();
  const day = d.getDate().toString();
  const hours = d.getHours().toString();
  const minutes = d.getMinutes().toString();

  user.date = `${year}-${month.padStart(2, "0")}-${day.padStart(
    2,
    "0"
  )}, ${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;

  next();
});

const Note = new mongoose.model("Note", noteSchema);
module.exports = Note;
