import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { sendOTP } from '../utils/email.js';
const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) 
            return res.status(400).json({ error: "Missing fields" });

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ error: "Email already registered" });

        const hashed = await
            bcrypt.hash(password, 10);
            const trialEnd = new Date();
            trialEnd.setDate(trialEnd.getDate() + parseInt(process.env.TRIAL_DAYS || "7"));

            const newUser = new User({username, email, password: hashed, trialEnd });
            await newUser.save();

            const otp = Math.floor(100000 + Math.random() * 900000);
            await sendOTP(email, otp);

            res.status(201).json({ message: "User created, OTP sent to email" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message});    
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) // !(await bcrypt.compare(password, user.password)))
            return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

export default router;