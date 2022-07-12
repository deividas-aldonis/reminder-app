const express = require("express");
const router = express.Router();
const sendMail = require("../modules/email");

router.post("/test", (req, res) => {
  sendMail("deividasaldo76@gmail.com");

  res.send("");
});

module.exports = router;
