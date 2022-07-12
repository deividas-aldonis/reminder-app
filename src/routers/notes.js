const express = require("express");
const router = express.Router();
const schedule = require("node-schedule");
const sendMail = require("../modules/email");

router.post("/test", (req, res) => {
  //   sendMail("deividasaldo76@gmail.com");
  // const job = schedule.scheduleJob()
  console.log(req.body.date);

  const d = req.body.date;

  res.send("");
});

module.exports = router;
