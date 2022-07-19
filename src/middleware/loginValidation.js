const validator = require("validator");

const loginValidation = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    return res.render("login", {
      error: "Missing Fields, Please fill in all the fields",
    });
  }

  const regularExpression =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  const validPassword = password.match(regularExpression);

  if (!validPassword) {
    res.status(400);
    return res.render("login", {
      error: "Bad Credentials",
    });
  }

  if (!validator.isEmail(email)) {
    res.status(400);
    return res.render("login", { error: "Bad Credentials" });
  }

  next();
};

module.exports = loginValidation;
