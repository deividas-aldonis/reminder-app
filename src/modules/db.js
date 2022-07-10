const mongoose = require("mongoose");
mongoose.connect(
  process.env.MONGO_CONNECTION_STRING,
  {
    useNewUrlParser: true,
  },
  (error, data) => {
    if (error) return console.log(error);
    console.log("DB connected");
  }
);
