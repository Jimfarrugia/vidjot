const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// connect to mongoose
mongoose
  .connect("mongodb://localhost/vidjot-dev", { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB Connected")
  })
  .catch(err => {
    console.log(`Error: ${err}`)
  });

// Load Idea model
require('./models/Idea')
const Idea = mongoose.model('ideas');

// handlebars middleware
app.engine("handlebars", exphbs({
    defaultLayout: "main"
  }));
app.set("view engine", "handlebars");

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// Index Route
app.get("/", (req, res) => {
  const title = "Welcome";
  res.render("index", {
    title: title
  });
});

// About Route
app.get("/about", (req, res) => {
  res.render("about")
});

// Add Idea Form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

// Process form
app.post('/ideas', (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({text: "Please add a title."})
  }
  if (!req.body.details) {
    errors.push({text: "Please enter some details."})
  }
  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    res.send('passed');
  }
})

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});
