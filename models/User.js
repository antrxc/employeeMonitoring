const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  employeeCode: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Manager", "Employee"], default: "Employee" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
