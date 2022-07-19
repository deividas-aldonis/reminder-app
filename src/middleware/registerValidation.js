const validator = require("validator");

const registerValidation = (req, res, next) => {
  const { email, password, password1 } = req.body;

  if (!email || !password || !password1) {
    res.status(400);
    return res.render("register", {
      error: "Missing Fields, Please fill in all the fields",
    });
  }

  if (!validator.isEmail(email)) {
    res.status(400);
    return res.render("register", { error: "Invalid email" });
  }

  const regularExpression =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  const validPassword = password.match(regularExpression);

  if (!validPassword) {
    res.status(400);
    return res.render("register", {
      error:
        "Password requirements:\nMinimum eight characters, at least one letter, one number and one special character",
    });
  }

  if (password !== password1) {
    res.status(400);
    return res.render("register", {
      error: "Passwords must match",
    });
  }

  next();
};

module.exports = registerValidation;
