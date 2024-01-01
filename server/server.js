import { dirname, join } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { hash, compare } from "bcrypt";
import User from "./models/userModel.js";
import Task from "./models/taskModel.js";
import express, { json } from "express";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  isEmailValid,
  adequatePasswordComplexity,
} from "../client/src/shared/sharedUtils.mjs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env") });
const app = express();
const port = process.env.PORT;
const SALT_ROUNDS = 10;

// Parse JSON request body
app.use(json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.REACT_APP_FRONTEND_URL,
  })
);

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

const sendPasswordResetEmail = async (recipient, resetToken) => {
  const url = `${process.env.REACT_APP_FRONTEND_URL}/reset-password?email=${recipient}&token=${resetToken}`;
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: recipient,
    subject: "Password Reset",
    text: `Please click on the following link to reset your password: ${url}.`,
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

const generateAuthToken = (userId, expiration, tokenType) => {
  const token = jwt.sign(
    { userId: userId, type: tokenType },
    process.env.JWT_SECRET,
    {
      expiresIn: expiration,
    }
  );
  return token;
};

const generateAccessToken = (userId) => {
  return generateAuthToken(userId, "1h", "access");
};

const generateRefreshToken = (userId) => {
  return generateAuthToken(userId, "30d", "refresh");
};

const generatePasswordResetToken = () => {
  const uuid = uuidv4();
  return uuid;
};

const removeSensitiveProperties = (object) => {
  delete object.passwordHash;
  delete object.verified;
  delete object.verificationCode;
  delete object.codeExpirationTime;
  delete object.resetTokenHash;
  delete object.resetTokenExpirationTime;
};

// Throws an error if there is any issue with the token (token expired,
// token for the incorrect user or invalid token)
const verifyToken = (token, secret, reqId) => {
  try {
    const decodedToken = jwt.verify(token, secret);
    const tokenUserId = decodedToken.userId;

    // If there is a mismatch of Ids, then the request is illegal
    if (tokenUserId !== reqId) {
      throw new Error("Forbidden");
    }
  } catch (error) {
    console.error(error);
    if (error.message.includes("expired")) {
      throw new Error("Token expired");
    } else {
      throw new Error("Invalid token");
    }
  }
};

// Checks whether there is a logged in user
app.get("/check-auth", (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({ error: "Not authenticated." });
    }
    jwt.verify(accessToken, process.env.JWT_SECRET);
    res.status(200).json({ message: "Authenticated." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error authenticating user." });
  }
});

// Verify user's email address
app.post("/users/verify", async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });
    if (user.codeExpirationTime < Date.now()) {
      return res.status(400).json({ error: "Verification code expired." });
    }
    if (user.verificationCode !== code) {
      return res.status(400).json({ error: "Invalid verification code." });
    }

    user.verified = true;
    await user.save();
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });

    res.status(200).json({ userId: user._id });
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
    if (!user) return res.status(404).json({ error: "User not found." });
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

    res
      .status(200)
      .json({ message: "New verification code sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Middleware function to validate JWTs stored as HTTP-only cookies
const authMiddleware = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  const reqId = req.params.userId;

  if (!accessToken) {
    return res
      .status(401)
      .json({ error: "Unauthorized - No access token provided." });
  }

  if (!refreshToken) {
    return res
      .status(401)
      .json({ error: "Unauthorized - No refresh token provided." });
  }

  let accessTokenExpired = false;

  try {
    verifyToken(accessToken, process.env.JWT_SECRET, reqId);
    // Since the token is valid and for the correct user, invoke the next function
    next();
  } catch (error) {
    if (error.message === "Token expired") {
      // Do not return an error response yet, try first to use the refresh token
      accessTokenExpired = true;
    } else if (error.message === "Forbidden") {
      return res.status(403).json({
        error: "Forbidden - User does not have necessary permissions.",
      });
    } else {
      return res.status(401).json({ error: "Unauthorized - Invalid token." });
    }
  }

  if (accessTokenExpired) {
    try {
      verifyToken(refreshToken, process.env.JWT_SECRET, reqId);
      // Generate a new access token for the user since the provided one expired
      const accessToken = generateAccessToken(reqId);
      res.clearCookie("accessToken");
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
      });

      // Since the token is valid and for the correct user, invoke the next function
      next();
    } catch (error) {
      if (error.message === "Token expired") {
        return res
          .status(401)
          .json({ error: "Unauthorized - Refresh token expired." });
      } else if (error.message === "Forbidden") {
        return res.status(403).json({
          error: "Forbidden - User does not have necessary permissions.",
        });
      } else {
        return res.status(401).json({ error: "Unauthorized - Invalid token." });
      }
    }
  }
};

// Create user
app.post("/users", async (req, res) => {
  const { email, password } = req.body;

  if (!isEmailValid(email)) {
    return res.status(400).json({ error: "Invalid email." });
  }

  const errorMessage = adequatePasswordComplexity(password);
  if (errorMessage) {
    return res.status(400).json({ error: "Invalid password." });
  }

  // Do not allow an account to be created with an email address that is
  // already in use
  try {
    const user = await User.findOne({ email });
    if (user) return res.status(409).json({ error: "Email already in use." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error verifying whether email is already in use." });
  }

  try {
    const passwordHash = await hash(password, SALT_ROUNDS);
    const verificationCode = generateVerificationCode();
    const newUser = new User({
      name: "",
      email: email,
      passwordHash: passwordHash,
      verified: false,
      verificationCode: verificationCode,
      codeExpirationTime: generateCodeExpirationTime(),
      resetTokenHash: null,
      resetTokenExpirationTime: null,
      tasks: [],
    });

    await newUser.save();

    const emailSent = await sendVerificationCodeEmail(email, verificationCode);
    if (!emailSent) {
      return res
        .status(500)
        .json({ error: "Failed to send verification code email." });
    }

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Read user
app.get("/users/:userId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("tasks")
      .lean();
    if (!user) return res.status(404).json({ error: "User not found." });
    // Remove unnecessary attributes from the response
    removeSensitiveProperties(user);
    res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get user information." });
  }
});

// Update user
app.patch("/users/:userId", authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    removeSensitiveProperties(updates);
    const user = await User.findByIdAndUpdate(req.params.userId, updates, {
      new: true,
    }).lean();
    if (!user) return res.status(404).json({ error: "User not found." });
    removeSensitiveProperties(user);
    res.json(user);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Failed to update user information." });
  }
});

// Delete user
app.delete("/users/:userId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId).lean();
    if (!user) return res.status(404).json({ error: "User not found." });
    removeSensitiveProperties(user);
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

// Login user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });

    const isPasswordValid = await compare(password, user.passwordHash);
    if (!isPasswordValid)
      return res.status(401).json({ error: "Incorrect password." });

    if (!user.verified)
      return res.status(403).json({ error: "Account has not been verified." });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
    });

    res.status(200).json({ userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error logging in user." });
  }
});

// Logout user
app.get("/logout", async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ success: true });
});

// Generate password reset code
app.post("/password/reset", async (req, res) => {
  const { email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });

    const resetToken = generatePasswordResetToken();
    const resetTokenHash = await hash(resetToken, SALT_ROUNDS);
    user.resetTokenHash = resetTokenHash;
    user.resetTokenExpirationTime = generateCodeExpirationTime();
    await user.save();

    const emailSent = await sendPasswordResetEmail(email, resetToken);
    if (!emailSent) {
      return res
        .status(500)
        .json({ error: "Failed to send password reset email." });
    }

    res
      .status(200)
      .json({ message: "Password reset email sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Reset password
app.post("/password/update", async (req, res) => {
  const { email, resetToken, newPassword } = req.body;

  try {
    const errorMessage = adequatePasswordComplexity(newPassword);
    if (errorMessage) {
      return res.status(400).json({ error: errorMessage });
    }
    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });

    if (user.resetTokenExpirationTime < Date.now()) {
      return res.status(400).json({ error: "Password reset token expired." });
    }

    const isTokenValid = await compare(resetToken, user.resetTokenHash);
    if (!isTokenValid) return res.status(401).json({ error: "Invalid token." });

    const newPasswordHash = await hash(newPassword, SALT_ROUNDS);
    user.passwordHash = newPasswordHash;
    user.resetTokenHash = null;
    user.resetTokenExpirationTime = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Update password (for authenticated users)
app.patch("/users/:userId/password", authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const errorMessage = adequatePasswordComplexity(newPassword);
    if (errorMessage) {
      return res
        .status(400)
        .json({ error: "New p" + errorMessage.substring(1) });
    }

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    const isPasswordValid = await compare(currentPassword, user.passwordHash);
    if (!isPasswordValid)
      return res.status(401).json({ error: "Incorrect current password." });

    const newPasswordHash = await hash(newPassword, SALT_ROUNDS);
    user.passwordHash = newPasswordHash;
    await user.save();

    removeSensitiveProperties(user);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Create task
app.post("/users/:userId/tasks/", authMiddleware, async (req, res) => {
  const { title, description, dueDate } = req.body;
  try {
    let user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found." });

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
    res.json(newTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creating task." });
  }
});

// Update task
app.patch("/users/:userId/tasks/:taskId", authMiddleware, async (req, res) => {
  try {
    let user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    const updates = req.body;
    const task = await Task.findByIdAndUpdate(req.params.taskId, updates, {
      new: true,
    });
    if (!task) return res.status(404).json({ error: "Task not found." });
    res.json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
});

// Delete task
app.delete("/users/:userId/tasks/:taskId", authMiddleware, async (req, res) => {
  try {
    let user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    const task = await Task.findByIdAndDelete(req.params.taskId);
    if (!task) return res.status(404).json({ error: "Task not found." });

    await User.findByIdAndUpdate(user._id, { $pull: { tasks: task._id } });
    res.json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error deleting task." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
