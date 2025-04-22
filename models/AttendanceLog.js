const mongoose = require('mongoose');

const attendanceLogSchema = new mongoose.Schema({
  employeeCode: { type: String, required: true },
  logDate: { type: Date, required: true },
  downloadDate: { type: Date },
  deviceName: { type: String },
  serialNumber: { type: String },
  direction: { type: String }, // IN/OUT
  deviceDirection: { type: String },
  workCode: { type: String },
  verificationType: { type: String },
  gps: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('AttendanceLog', attendanceLogSchema);
