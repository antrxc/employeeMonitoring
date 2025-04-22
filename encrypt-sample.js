const crypto = require('crypto');

const data = {
  EmployeeCode: "EMP001",
  DownloadDate: "2025-04-21 08:05:12",
  LogDate: "2025-04-21 08:00:00",
  DeviceName: "SilkBio",
  SerialNumber: "ABC1234567890",
  Direction: "IN",
  DeviceDirection: "Device",
  WorkCode: "0",
  VerificationType: "Face",
  GPS: "0,0"
};

const json = JSON.stringify(data);
const key = Buffer.from("essl1234111111111111111111111111"); // 32-byte key
const iv = Buffer.alloc(16, 0); // 16-byte zero IV

const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
let encrypted = cipher.update(json, 'utf8', 'base64');
encrypted += cipher.final('base64');

console.log(JSON.stringify({ data: encrypted }));
