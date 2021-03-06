require("dotenv").config();
require("./modules/db");
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const userRouter = require("./routers/user");
const notesRouter = require("./routers/notes");

const app = express();
const port = process.env.PORT;
const publicDirPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");

app.set("view engine", "ejs");
app.set("views", viewsPath);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(publicDirPath));
app.use(cookieParser());

app.use(userRouter);
app.use(notesRouter);

app.listen(port, () => console.log("listening on port " + port));

