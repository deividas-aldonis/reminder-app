const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const registerValidation = require("../middleware/registerValidation");
const loginValidation = require("../middleware/loginValidation");
const auth = require("../middleware/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/", auth, (req, res) => {
  res.render("index", { user: req.user });
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/register", registerValidation, async (req, res) => {
  const { email, password } = req.body;

  // for testing purposes only
  // await User.deleteMany({});

  const userExists = await User.findOne({ email: email });
  if (userExists) {
    return res.render("register", { error: "Email is taken" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ email, password: hashedPassword });
  const token = jwt.sign({ _id: user._id.toString() });

  user.tokens = user.tokens.concat({ token });
  await user.save();
  res.cookie("jwtToken", token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });

  res.redirect(303, "/");
});

// Strong123@
router.post("/login", loginValidation, async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.render("login", { error: "Bad Credentials" });
  }

  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) {
    return res.render("login", { error: "Bad Credentials" });
  }

  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();

  res.cookie("jwtToken", token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });
  res.redirect(303, "/");
});

module.exports = router;
