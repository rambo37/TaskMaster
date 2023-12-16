import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String,
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
});

const User = mongoose.model("User", userSchema);

export default User;