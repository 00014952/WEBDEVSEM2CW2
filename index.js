const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const Job = require("./job");

app.set("view engine", "ejs");
app.set("views", "./views");
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

mongoose.connect(
  "mongodb+srv://user:1234user5678@cluster0.uqvt1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
);
const db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error:"));
db.once("open", () => {
  console.log("DB IS CONNECTED");
});

app.get("/", (req, res) => res.render("home"));

app.get("jobs", (req, res) => {
  const jobs = Job.find();
  res.render("jobs", { jobs });
});

app.get("todos", (req, res) => {
  fs.readFile(DB, (err, data) => {
    if (err) throw err;
    const tasks = JSON.parse(data);
    res.render("todos", { tasks: tasks });
  });
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});
app.listen(3000, () => console.log("Server started on port 3000"));
