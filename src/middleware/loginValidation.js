const validator = require("validator");

const loginValidation = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    return res.render("login", {
      error: "Missing Fields, Please fill in all the fields",
    });
  }

  if (!validator.isEmail(email)) {
    res.status(400);
    return res.render("login", { error: "Invalid email" });
  }

  next();
};

module.exports = loginValidation;
