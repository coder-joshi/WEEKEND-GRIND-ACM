const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const users = [
  {
    name: "Rahul",
    studentId: "123",
    phoneNumber: "9876543210",
    preference: "veg",
    hostelName: "Boys Hostel A"
  },
  {
    name: "Aman",
    studentId: "124",
    phoneNumber: "9123456780",
    preference: "non-veg",
    hostelName: "Boys Hostel B"
  },{
    name: "Atharv",
    studentId: "1BM25CS071",
    phoneNumber: "9369615070",
    preference: "veg",
    hostelName: "NBH-10"
  }
];

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log("MongoDB connected");

    await User.deleteMany(); // optional (clears old data)

    await User.insertMany(users);

    console.log("Users inserted");
    process.exit();
})
.catch(err => console.log(err));