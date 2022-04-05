const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
app.set("view engine", "ejs");
app.set("views", "./views");
app.engine("ejs", ejsMate);

app.get("/", (req, res) => res.render("home"));

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
