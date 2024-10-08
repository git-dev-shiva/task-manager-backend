const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const USER = require("./model/userSchema");
const NoteSchema = require("./model/noteSchema");
const NOTE = mongoose.model("NOTEMODEL");
const connection = require("./connection/connection");
connection();
const port = 8081;
const auth = require("./Auth");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
app.use(cors());

mongoose.connection.on("connected", () => {
  console.log("connected to mongoDB");
});
mongoose.connection.on("error", () => {
  console.log("failed to connect to mongoDB");
});

require("./model/userSchema");
require("./model/noteSchema");
app.use(express.json());

app.use(require("./routes/routes"));

//creating the post
app.post("/tasks", auth, (req, res) => {
  const { title, description, completed } = req.body;
  if (!title) {
    return res.status(402).json({
      error: "please fill all the fields",
    });
  }
  const Note = new NOTE({
    user: req.user,
    title,
    description,
    completed,
  });
  Note.save()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => console.log(err));
});

//get all api
app.get("/tasks", auth, (req, res) => {
  const userId = req.user;
  NOTE.find({ user: userId })
    .sort({ createdAt: -1 })
    .then((note) => res.json(note))
    .catch((err) => console.log(err));
});

//delete api
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const event = await NOTE.findByIdAndDelete(id);

  if (event) {
    res.json({
      message: "delete sucesssfully",
    });
  } else {
    res.status(400).json({
      message: "note not found",
    });
  }
});

//update api
app.patch("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const event = await NOTE.findByIdAndUpdate(id, req.body, { new: true });

  if (event) {
    res.status(200).json({
      event,
      message: "updated sucessfully",
    });
  } else {
    res.status(400).json({
      message: "there is no note with this id",
    });
  }
});

//get by id api
app.get("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await NOTE.findOne({ _id: id });

    if (data) {
      res.json(data).status(200);
    } else {
      res.status(404).json({
        message: "There is no data with this id",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "error retrieving data",
    });
  }
});

app.post("/verifying", (req, res, next) => {
  auth;
});

app.listen(port, () => {
  console.log(`Server is up at port: ${port}`);
});
