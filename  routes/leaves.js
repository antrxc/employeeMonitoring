const express = require("express");
const router = express.Router();
const LeaveRequest = require("../models/LeaveRequest");

// Apply for leave (POST /leaves/apply)
router.post("/apply", async (req, res) => {
  try {
    const { employeeCode, type, fromDate, toDate, reason } = req.body;

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

// View all leave requests (GET /leaves)
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

// Approve or reject leave (PATCH /leaves/:id)
router.patch("/:id", async (req, res) => {
  try {
    const { status, reviewedBy } = req.body;
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewedBy,
        reviewedAt: new Date(),
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Error updating leave:", err);
    res.status(500).json({ message: "Failed to update leave status" });
  }
});

module.exports = router;
