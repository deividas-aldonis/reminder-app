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
    /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$@%&? "])[a-zA-Z0-9!#$@%&?]{8,20}$/;
  const validPassword = password.match(regularExpression);

  if (!validPassword) {
    res.status(400);
    return res.render("register", {
      error:
        "Password requirements:\n1. Length between (8-20)\n2. At least one uppercase character \n3. At least one lowercase character\n4. At least one digit\n5. At least one special character \n6. Special characters allowed: !#$@%&?",
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
