const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// middlewares
const registerValidation = require("../middleware/registerValidation");
const loginValidation = require("../middleware/loginValidation");
const auth = require("../middleware/auth");
// models
const User = require("../models/user");
const Note = require("../models/note");

const router = express.Router();

// home
router.get("/", auth, async (req, res) => {
  const notes = await Note.find({ owner: req.user._id });

  notes.map((note) => {
    const d = new Date(note.date);
    const year = d.getFullYear().toString();
    const month = (d.getMonth() + 1).toString();
    const day = d.getDate().toString();
    const hours = d.getHours().toString();
    const minutes = d.getMinutes().toString();

    note.date = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}, ${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;

    return note;
  });

  res.render("index", { user: req.user, notes });
});

// register GET
router.get("/register", (req, res) => {
  res.render("register");
});

// login GET
router.get("/login", (req, res) => {
  res.render("login");
});

// register POST
router.post("/register", registerValidation, async (req, res) => {
  const { email, password } = req.body;

  await User.deleteMany({});

  const userExists = await User.findOne({ email: email });
  if (userExists) {
    res.status(409);
    return res.render("register", { error: "Email is taken" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ email, password: hashedPassword });
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  res.cookie("jwtToken", token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });
  res.redirect(303, "/");
});

// login POST
router.post("/login", loginValidation, async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    return res.render("login", { error: "Bad Credentials" });
  }

  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) {
    res.status(401);
    return res.render("login", { error: "Bad Credentials" });
  }

  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();

  res.cookie("jwtToken", token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });
  res.redirect(303, "/");
});

router.get("/completed", auth, async (req, res) => {
  const notes = await Note.find({ owner: req.user._id, completed: true });

  notes.map((note) => {
    const d = new Date(note.date);
    const year = d.getFullYear().toString();
    const month = (d.getMonth() + 1).toString();
    const day = d.getDate().toString();
    const hours = d.getHours().toString();
    const minutes = d.getMinutes().toString();

    note.date = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}, ${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;

    return note;
  });

  res.render("index", { user: req.user, notes });
});

router.get("/ongoing", auth, async (req, res) => {
  const notes = await Note.find({ owner: req.user._id, completed: false });

  notes.map((note) => {
    const d = new Date(note.date);
    const year = d.getFullYear().toString();
    const month = (d.getMonth() + 1).toString();
    const day = d.getDate().toString();
    const hours = d.getHours().toString();
    const minutes = d.getMinutes().toString();

    note.date = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}, ${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;

    return note;
  });

  res.render("index", { user: req.user, notes });
});

module.exports = router;
