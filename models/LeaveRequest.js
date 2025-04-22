const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
  employeeCode: { type: String, required: true },
  type: { type: String, enum: ["Sick", "Casual", "Earned", "Other"], required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  reason: { type: String },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  requestedAt: { type: Date, default: Date.now },
  reviewedBy: { type: String }, // admin/manager code
  reviewedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);

