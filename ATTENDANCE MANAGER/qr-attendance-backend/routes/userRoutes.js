const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Attendance = require("../models/Attendance");

// GET /api/daily-qr — returns today's date string (used to generate QR on admin screen)
router.get("/daily-qr", (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  res.json({ qrData: today });
});

// POST /api/scan — student scans QR, enters studentId
router.post("/scan", async (req, res) => {
  try {
    const { studentId, scannedDate } = req.body;

    // 1. Validate the scanned date matches today
    const today = new Date().toISOString().split("T")[0];
    if (scannedDate !== today) {
      return res.status(400).json({ message: "QR code is expired. Please scan today's QR." });
    }

    // 2. Check if user exists
    const user = await User.findOne({ studentId });
    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 3. Check if already marked attendance today
    const existing = await Attendance.findOne({ userId: user._id, date: today });
    if (existing) {
      return res.status(400).json({ message: "Already taken food today" });
    }

    // 4. Mark attendance
    await Attendance.create({ userId: user._id, name:user.name,date: today });

    res.status(201).json({
      message: "Allowed ✅",
      name: user.name,
      studentId: user.studentId,
      preference: user.preference,
      hostelName: user.hostelName,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;