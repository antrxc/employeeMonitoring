const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const AttendanceLog = require('../models/AttendanceLog');

// This key MUST match the one used in eBioserverNew (32 characters)
const AES_KEY = Buffer.from('essl1234111111111111111111111111'); // ✅ 32 chars

const AES_IV = Buffer.alloc(16, 0); // 16-byte IV (eBioserver uses zero IV)

function decryptData(encrypted) {
  const buffer = Buffer.from(encrypted, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-cbc', AES_KEY, AES_IV);
  let decrypted = decipher.update(buffer, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

router.post('/', async (req, res) => {
    try {
      const encryptedData = req.body.data;
  
      if (!encryptedData) {
        throw new Error('Missing "data" in request body');
      }
  
      const decrypted = decryptData(encryptedData);
      console.log('🔓 Decrypted string:\n', decrypted);
  
      const json = JSON.parse(decrypted);
      console.log('📦 Parsed JSON:\n', json);
  
      const log = new AttendanceLog({
        employeeCode: json.EmployeeCode,
        downloadDate: new Date(json.DownloadDate),
        logDate: new Date(json.LogDate),
        deviceName: json.DeviceName,
        serialNumber: json.SerialNumber,
        direction: json.Direction,
        deviceDirection: json.DeviceDirection,
        workCode: json.WorkCode,
        verificationType: json.VerificationType,
        gps: json.GPS
      });
      const Profile = require("../models/Profile");

      const profileExists = await Profile.findOne({ employeeCode: json.EmployeeCode });

      if (!profileExists) {
        await Profile.create({
          employeeCode: json.EmployeeCode,
          role: "Employee" // default
        });
      }

  
      await log.save();
  
      req.io?.emit('new-log', log);
  
      res.status(200).json({ message: 'Success' });
  
    } catch (err) {
      console.error('❌ Webhook error:', err);
      res.status(500).json({ message: 'Failed to process log', error: err.message });
    }
  });
  

module.exports = router;
