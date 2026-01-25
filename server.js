require ('dotenv').config();
const express = require("express");
const mongoose = require ("mongoose")
const cors = require ("cors")

const adminRoutes = require ("./routes/adminRoutes")
app.use(cors());
app.use(express.json());

mongoose.connect (process.env.MONGO_URI)
.then (()=> console.log ("MongoDB connected"))
.catch ((err)=> console.log (err))

app.use ("/api/admin", adminRoutes)

app.get ("/", (req, res) => {
    res.send ("Backend is running")
});
app.listen (process.env.PORT, () => console.log (`Server running on port ${process.env.PORT}`));