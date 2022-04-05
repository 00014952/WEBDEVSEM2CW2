const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const Job = require("./job");
const methodOverride = require("method-override");
const job = require("./job");

app.set("view engine", "ejs");
app.set("views", "./views");
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

mongoose.connect(
  "mongodb+srv://user:1234user5678@cluster0.uqvt1.mongodb.net/jobsDatabase?retryWrites=true&w=majority"
);
const db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error:"));
db.once("open", () => {
  console.log("DB IS CONNECTED");
});
//home page
app.get("/", (req, res) => res.render("home"));
//get list of jobs
app.get("/jobs", async (req, res) => {
  const jobs = await Job.find();
  res.render("jobs", { jobs });
});
//create form
app.get("/jobs/create", (req, res) => res.render("create"));
//create action
app.post("/jobs", async (req, res, next) => {
  try {
    const job = new Job(req.body.job);
    await job.save();
    res.redirect("/jobs");
  } catch (error) {
    next(error);
  }
});
//details
app.get("/jobs/:id", async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  res.render("details", { job });
});
//update form
app.get("/jobs/:id/update", async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    res.render("update", { job });
  } catch (error) {
    next(error);
  }
});
//update
app.put("/jobs/:id", async (req, res) => {
  const { id } = req.params;
  const job = await Job.findByIdAndUpdate(id, req.body.job);
  res.redirect("/jobs");
});
//remove
app.delete("/jobs/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await Job.findByIdAndDelete(id);
    res.redirect("/jobs");
  } catch (error) {
    next(error);
  }
});
//errror handling
app.use((err, req, res, next) => {
  res.render("error", { err });
});
app.listen(3000, () => console.log("Server started on port 3000"));
