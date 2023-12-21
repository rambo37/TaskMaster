import { dirname, join } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { hash, compare } from "bcrypt";
import User from "./models/userModel.js";
import Task from "./models/taskModel.js";
import express, { json } from "express";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env") });
const app = express();
const port = process.env.PORT;

// Parse JSON request body
app.use(json());

import { connect } from "mongoose";
connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error(error));

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendVerificationCodeEmail = async (recipient, code) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: recipient,
    subject: "Verification Code",
    text: `Your verification code is ${code}.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const generateVerificationCode = () => {
  return Math.floor(Math.random() * 900000) + 100000;
};

const generateCodeExpirationTime = () => {
  return new Date(new Date().getTime() + 60 * 60 * 1000);
};

const generateAuthToken = (user) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

// Verify user's email address
app.post("/users/verify", async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user.codeExpirationTime < Date.now()) {
      return res.status(400).json({ error: "Verification code expired." });
    }
    if (user.verificationCode !== code) {
      return res.status(400).json({ error: "Invalid verification code." });
    }

    user.verified = true;
    await user.save();
    const token = generateAuthToken(user);
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Resend verification code to user's email address
app.post("/users/resend-verification", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    const verificationCode = generateVerificationCode();
    user.verificationCode = verificationCode;
    user.codeExpirationTime = generateCodeExpirationTime();
    await user.save();

    const emailSent = await sendVerificationCodeEmail(email, verificationCode);
    if (!emailSent) {
      return res
        .status(500)
        .json({ error: "Failed to send verification code email." });
    }

    res.status(200).send("New verification code sent successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Create user
app.post("/users", async (req, res) => {
  const { email, password } = req.body;
  // Do not allow an account to be created with an email address that is
  // already in use
  try {
    const user = await User.findOne({ email });
    if (user) return res.status(409).send("Email already in use.");
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send("Error verifying whether email is already in use.");
  }

  try {
    const saltRounds = 10;
    const passwordHash = await hash(password, saltRounds);
    const verificationCode = generateVerificationCode();
    const newUser = new User({
      name: "",
      email: email,
      passwordHash: passwordHash,
      verified: false,
      verificationCode: verificationCode,
      codeExpirationTime: generateCodeExpirationTime(),
      tasks: [],
    });

    await newUser.save();

    const emailSent = await sendVerificationCodeEmail(email, verificationCode);
    if (!emailSent) {
      return res
        .status(500)
        .json({ error: "Failed to send verification code email." });
    }

    res.status(201).send("User registered successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Read user
app.get("/users/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("tasks")
      .lean();
    if (!user) return res.status(404).send("User not found.");
    // Remove unnecessary attributes from the response
    delete user.passwordHash;
    delete user.verified;
    delete user.verificationCode;
    delete user.codeExpirationTime;
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

    const isPasswordValid = await compare(password, user.passwordHash);
    if (!isPasswordValid) return res.status(401).send("Incorrect password.");

    if (!user.verified)
      return res.status(403).send("Account has not been verified.");

    const token = generateAuthToken(user);
    res.status(200).json({ token });
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

export default app;
