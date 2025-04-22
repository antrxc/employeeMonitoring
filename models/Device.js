const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceName: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  direction: { type: String, enum: ['IN', 'OUT'] },
  location: { type: String, required: true },
  activationCode: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);
