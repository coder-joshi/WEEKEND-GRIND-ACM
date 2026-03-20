const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
  },
  date: String,
  taken: {
    type: Boolean,
    default: true,
  },
});

// Prevent duplicate entries per day
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

const attendanceModel = mongoose.model("Attendance", attendanceSchema);

module.exports = attendanceModel;
