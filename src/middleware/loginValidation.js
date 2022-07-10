const validator = require("validator");

const loginValidation = (req, res, next) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    return res.render("register", { error: "Bad Credentials" });
  }

  const regularExpression =
    /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$@%&? "])[a-zA-Z0-9!#$@%&?]{8,20}$/;
  const match = password.match(regularExpression);

  if (!match) {
    return res.render("register", {
      error: "Bad Credentials",
    });
  }

  next();
};

module.exports = loginValidation;
