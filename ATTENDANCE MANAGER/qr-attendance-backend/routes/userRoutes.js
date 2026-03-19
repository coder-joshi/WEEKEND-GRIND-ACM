const express = require("express");
const router = express.Router();

const User = require("../models/User")
const Attendance = require("../models/Attendance");

router.post("/scan",async(req,res)=>{
    try {
        const {studentId} = req.body;

    // Checking if user exists
    const user = await User.findOne({studentId});
    if(!user){
        return res.status(404).json({
            message: "User not found"
        })
    }

    //Getting today's date
    const today = new Date().toISOString().split("T")[0];

    const existing = await Attendance.findOne({
        userId: user._id,
        date: today
    })

    //Checking if already taken
    if(existing){
        return res.status(400).json({
            message: "Already taken today"
        })
    }

    await Attendance.create({
        userId: user._id,
        date: today
    })

    res.status(201).json({
        message: "Allowed ✅",
        name: user.name,
        studentId: user.studentId,
        preference: user.preference,
        hostelName: user.hostelName
    });

    } catch (error) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
    
})

module.exports = router