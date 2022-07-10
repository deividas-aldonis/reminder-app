const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwtToken;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const user = await User.findOne(
      {
        _id: decoded._id,
        "tokens.token": token,
      },
      { password: 0, tokens: 0 }
    );

    if (!user) {
      return res.redirect("/register");
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    console.log(error.message);
    return res.redirect("/register");
  }

  next();
};

module.exports = auth;
