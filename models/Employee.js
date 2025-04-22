const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String },
  cardNumber: { type: String },
  password: { type: String },
  deviceRole: { type: String }, // e.g., Admin, User
  verificationType: { type: String }, // Finger, Face, Card, etc.
  expiryFrom: { type: Date },
  expiryTo: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
