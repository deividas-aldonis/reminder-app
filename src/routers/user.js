const express = require("express");
const router = express.Router();
const registerValidation = require("../middleware/registerValidation");
const loginValidation = require("../middleware/loginValidation");

router.get("", (req, res) => {
  res.render("index");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/register", registerValidation, (req, res) => {
  res.render("register", {
    error: "You're in!",
  });
});

router.post("/login", loginValidation, (req, res) => {
  res.render("login", {
    error: "You're in!",
  });
});

module.exports = router;
