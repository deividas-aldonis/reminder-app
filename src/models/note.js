const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      // index: true,
    },
    description: {
      type: String,
      required: true,
      // index: true,
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
noteSchema.index({ "$**": "text" });

const Note = new mongoose.model("Note", noteSchema);
module.exports = Note;
