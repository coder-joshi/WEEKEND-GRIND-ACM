const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    preference: {
        type: String,
        enum: ["veg", "non-veg"],
        required: true
    },
    hostelName: {
        type: String,
        required: true
    }
},{ timestamps: true });

module.exports = mongoose.model("User", userSchema);