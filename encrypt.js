const crypto = require("crypto");

const AES_KEY = Buffer.from("essl1234111111111111111111111111"); // 32-byte key
const AES_IV = Buffer.alloc(16, 0); // 16-byte IV (all zeros)

const samplePayload = {
  EmployeeCode: "EMP123",
  DownloadDate: "2025-04-21 12:00:00",
  LogDate: "2025-04-21 11:59:00",
  DeviceName: "SilkBio",
  SerialNumber: "SN0012345",
  Direction: "IN",
  DeviceDirection: "Device",
  WorkCode: "0",
  VerificationType: "Face",
  GPS: "0,0"
};

function encryptData(json) {
  const cipher = crypto.createCipheriv("aes-256-cbc", AES_KEY, AES_IV);
  let encrypted = cipher.update(JSON.stringify(json), "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

const encryptedPayload = encryptData(samplePayload);
console.log("\nEncrypted Payload:\n");
console.log(JSON.stringify({ data: encryptedPayload }, null, 2));
