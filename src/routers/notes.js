const express = require("express");
const router = express.Router();
const schedule = require("node-schedule");
const sendMail = require("../modules/email");
const validation = require("../middleware/noteValidation");
const auth = require("../middleware/auth");
const Note = require("../models/note");
const escape = require("escape-regexp");

const updateStatus = async (noteId, userId) => {
  await Note.findOneAndUpdate(
    { _id: noteId, owner: userId },
    { completed: true }
  );
};

router.post("/notes", auth, validation, async (req, res) => {
  const { title, description, date } = req.body;

  const note = await Note.create({
    owner: req.user._id,
    title,
    description,
    date,
    completed: false,
  });

  const jobName = note._id.toString();

  schedule.scheduleJob(jobName, date,  function () {
    updateStatus(note._id, req.user._id);
    sendMail("deividasaldo76@gmail.com", title, description);
  });
  res.status(200).send();
});

router.delete("/notes/:id", auth, async (req, res) => {
  await Note.findOneAndDelete({
    owner: req.user._id,
    _id: req.params.id,
  });
  const job = schedule.scheduledJobs[req.params.id];
  job.cancel();
  res.status(200).send();
});

router.put("/notes/:id", auth, validation, async (req, res) => {
  const { title, description, date } = req.body;
  await Note.findOneAndUpdate(
    { owner: req.user._id, _id: req.params.id },
    { title, description, date }
  );

  schedule.rescheduleJob(req.params.id, date, function () {
    updateStatus(req.params.id, req.user._id);
    sendMail("deividasaldo76@gmail.com", title, description);
  });

  res.status(200).send();
});

router.get("/completed", auth, async (req, res) => {
  const allNotesCount = await Note.countDocuments({ owner: req.user._id });
  const completedNotes = await Note.find({
    owner: req.user._id,
    completed: true,
  });

  const completed = completedNotes.length;
  const ongoing = allNotesCount - completed;
  res.render("index", {
    user: req.user,
    notes: completedNotes,
    completed,
    ongoing,
  });
});

router.get("/ongoing", auth, async (req, res) => {
  const allNotesCount = await Note.countDocuments({ owner: req.user._id });
  const ongoingNotes = await Note.find({
    owner: req.user._id,
    completed: false,
  });

  const ongoing = ongoingNotes.length;
  const completed = allNotesCount - ongoing;
  res.render("index", {
    user: req.user,
    notes: ongoingNotes,
    completed,
    ongoing,
  });
});

router.get("/search", auth, async (req, res) => {
  const query = req.query.q;
  const allNotes = await Note.find({ owner: req.user._id });

  const completed = allNotes.filter((n) => n.completed).length;
  const ongoing = allNotes.filter((n) => !n.completed).length;

  const notes = await Note.find({
    $or: [
      { title: { $regex: escape(query), $options: "i" } },
      { description: { $regex: escape(query), $options: "i" } },
    ],
  });

  res.render("index", { user: req.user, notes, completed, ongoing });
});

module.exports = router;
