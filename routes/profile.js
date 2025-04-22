const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");

// GET /profile/:employeeCode/leaves
router.get("/:employeeCode/leaves", async (req, res) => {
  try {
    const { employeeCode } = req.params;

    const profile = await Profile.findOne({ employeeCode });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const balance = {};
    const types = Object.keys(profile.leaveEntitlement || {});
    for (const type of types) {
      balance[type] = {
        entitled: profile.leaveEntitlement[type],
        used: profile.leaveUsed[type] || 0,
        available: profile.leaveEntitlement[type] - (profile.leaveUsed[type] || 0)
      };
    }

    res.json({
      employeeCode,
      role: profile.role,
      leaveBalance: balance
    });
  } catch (err) {
    console.error("Error fetching leave balance:", err);
    res.status(500).json({ message: "Failed to fetch leave balance" });
  }
});

module.exports = router;
