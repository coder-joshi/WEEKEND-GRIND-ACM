const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Attendance = require("../models/Attendance");

// GET /api/admin/daily-qr — returns today's date string for QR generation
router.get("/daily-qr", (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  res.json({ qrData: today });
});

// GET /api/admin/today — returns today's attendance list + stats
router.get("/today", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Get all attendance records for today, populate user info
    const records = await Attendance.find({ date: today }).populate(
      "userId",
      "name studentId preference hostelName"
    );

    const totalStudents = await User.countDocuments();

    const list = records.map((r) => ({
      name: r.userId?.name,
      studentId: r.userId?.studentId,
      preference: r.userId?.preference,
      hostelName: r.userId?.hostelName,
    }));

    res.json({
      date: today,
      totalStudents,
      totalTaken: list.length,
      list,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;