const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config();
const app = express()

app.use(cors());
app.use(express.json());

//Routes
 
app.use("/api",require("./routes/userRoutes"))
app.use("/api/admin", require("./routes/adminRoutes"));
console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB Connected")
    app.listen(3000,()=>{
        console.log("Server running at port 3000")
    })
})
.catch((err)=>{console.log(err)});