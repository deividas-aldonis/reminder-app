const express = require("express");
const router = express.Router();
const schedule = require("node-schedule");
const sendMail = require("../modules/email");
const validation = require("../middleware/noteValidation");
const auth = require("../middleware/auth");
const Note = require("../models/note");

router.post("/notes", auth, validation, async (req, res) => {
  const { title, description, date } = req.body;

  const note = await Note.create({
    owner: req.user._id,
    title,
    description,
    date,
  });

  const jobName = note._id.toString();

  schedule.scheduleJob(jobName, date, function () {
    sendMail("deividasaldo76@gmail.com", title, description);
  });
  res.status(200).send({ id: note._id });
});

router.delete("/notes/:id", auth, async (req, res) => {
  const note = await Note.findOneAndDelete({
    owner: req.user._id,
    _id: req.params.id,
  });

  const jobName = note._id.toString();
  const job = schedule.scheduledJobs[jobName];
  job.cancel();
  res.status(200).send();
});

router.put("/notes/:id", auth, async (req, res) => {
  const { title, description, date } = req.body;
  const exists = await Note.findOneAndUpdate(
    { owner: req.user._id, _id: req.params.id },
    { title, description, date }
  );

  if (!exists) {
    return res.status(400).send();
  }

  const job = schedule.scheduledJobs[req.params.id];
  if (!job) {
    return res.status(400).send();
  }
  schedule.rescheduleJob(req.params.id, date, function () {
    sendMail("deividasaldo76@gmail.com", title, description);
  });

  res.status(200).send();
});

module.exports = router;
