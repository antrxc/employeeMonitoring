const express = require("express");
const router = express.Router();
const LeaveRequest = require("../models/LeaveRequest");
const Profile = require("../models/Profile");

// POST /leaves/apply
router.post("/apply", async (req, res) => {
  try {
    const { employeeCode, type, fromDate, toDate, reason } = req.body;

    const profile = await Profile.findOne({ employeeCode });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const totalDays =
      (new Date(toDate).getTime() - new Date(fromDate).getTime()) / (1000 * 60 * 60 * 24) + 1;

    const typeKey = type.toLowerCase(); // sick, casual, earned
    const entitled = profile.leaveEntitlement?.[typeKey] || 0;
    const used = profile.leaveUsed?.[typeKey] || 0;

    if (used + totalDays > entitled) {
      return res.status(400).json({ message: "Leave limit exceeded" });
    }

    const newLeave = new LeaveRequest({
      employeeCode,
      type,
      fromDate,
      toDate,
      reason,
    });

    const saved = await newLeave.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Leave apply error:", err);
    res.status(500).json({ message: "Failed to apply for leave" });
  }
});

// GET /leaves
router.get("/", async (req, res) => {
  try {
    const { employeeCode, status } = req.query;
    const filter = {};
    if (employeeCode) filter.employeeCode = employeeCode;
    if (status) filter.status = status;

    const leaves = await LeaveRequest.find(filter).sort({ requestedAt: -1 });
    res.json(leaves);
  } catch (err) {
    console.error("Error fetching leaves:", err);
    res.status(500).json({ message: "Failed to fetch leave requests" });
  }
});

// PATCH /leaves/:id (Approve or Reject)
router.patch("/:id", async (req, res) => {
  try {
    const { status, reviewedBy } = req.body;
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    if (leave.status === "Approved") {
      return res.status(400).json({ message: "Leave already approved" });
    }

    leave.status = status;
    leave.reviewedBy = reviewedBy;
    leave.reviewedAt = new Date();
    await leave.save();

    // Only update leaveUsed if approved
    if (status === "Approved") {
      const profile = await Profile.findOne({ employeeCode: leave.employeeCode });
      if (!profile) return res.status(404).json({ message: "Profile not found" });

      const totalDays =
        (new Date(leave.toDate).getTime() - new Date(leave.fromDate).getTime()) / (1000 * 60 * 60 * 24) + 1;

      const typeKey = leave.type.toLowerCase();
      profile.leaveUsed[typeKey] += totalDays;
      await profile.save();
    }

    res.json(leave);
  } catch (err) {
    console.error("Error updating leave:", err);
    res.status(500).json({ message: "Failed to update leave status" });
  }
});

module.exports = router;
