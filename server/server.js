const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const express = require("express");
const app = express();
const port = process.env.PORT;
const bcrypt = require("bcrypt");
const User = require(__dirname + "/models/userModel");
const Task = require(__dirname + "/models/taskModel");

// Parse JSON request body
app.use(express.json());

const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error(error));

// Create user
app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  // Do not allow an account to be created with an email address that is
  // already in use
  try {
    const user = await User.findOne({ email });
    if (user) return res.status(500).send("Email already in use.");
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send("Error verifying whether email is already in use.");
  }

  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name: name,
      email: email,
      passwordHash: passwordHash,
      tasks: [],
    });

    await newUser.save();
    res.status(201).send("User registered successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error registering user.");
  }
});

// Read user
app.get("/users/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("tasks")
      .lean();
    if (!user) return res.status(404).send("User not found.");
    delete user.passwordHash;
    res.send(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Failed to get user information.");
  }
});

// Update user
app.patch("/users/:userId", async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.params.userId, updates, {
      new: true,
    });
    if (!user) return res.status(404).send("User not found.");
    res.send(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Failed to update user information.");
  }
});

// Delete user
app.delete("/users/:userId", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).send("User not found");
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Login user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found.");

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) return res.status(401).send("Incorrect password.");

    res.status(200).send("User logged in successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in user.");
  }
});

// Create task
app.post("/users/:userId/tasks/", async (req, res) => {
  const { title, description, dueDate } = req.body;
  try {
    let user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send("User not found.");

    const newTask = new Task({
      title: title,
      description: description,
      dueDate: dueDate,
      completed: false,
      user: req.params.userId,
    });

    await newTask.save();

    const tasks = user.tasks.slice();
    tasks.push(newTask._id);
    const updatedTasks = { tasks: tasks };

    await User.findByIdAndUpdate(req.params.userId, updatedTasks);
    res.send(newTask);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error creating task.");
  }
});

// Update task
app.patch("/users/:userId/tasks/:taskId", async (req, res) => {
  try {
    let user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send("User not found.");

    const updates = req.body;
    const task = await Task.findByIdAndUpdate(req.params.taskId, updates, {
      new: true,
    });
    if (!task) return res.status(404).send("Task not found.");
    res.send(task);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// Delete task
app.delete("/users/:userId/tasks/:taskId", async (req, res) => {
  try {
    let user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send("User not found.");

    const task = await Task.findByIdAndDelete(req.params.taskId);
    if (!task) return res.status(404).send("Task not found");

    const tasks = user.tasks.slice();
    const index = tasks.indexOf(req.params.taskId);
    tasks.splice(index, 1);
    const updatedTasks = { tasks: tasks };

    await User.findByIdAndUpdate(req.params.userId, updatedTasks);

    res.send(task);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error deleting task");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
