const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  employeeCode: { type: String, required: true, unique: true },
  role: { type: String, enum: ["Admin", "Manager", "Employee"], default: "Employee" },
  leaveEntitlement: {
    sick: { type: Number, default: 5 },
    casual: { type: Number, default: 5 },
    earned: { type: Number, default: 10 }
  },
  leaveUsed: {
    sick: { type: Number, default: 0 },
    casual: { type: Number, default: 0 },
    earned: { type: Number, default: 0 }
  },
  preferences: {
    notifications: { type: Boolean, default: true }
  }
}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);
