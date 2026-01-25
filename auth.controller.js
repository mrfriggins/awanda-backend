import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import {generateOTP } from "../utils/otp.util.js";
import { sendEmail } from "../utils/email.util.js";
import { startTrial } from "../utils/trial.util.js";

export const SendOTP = async (req, res) => {
    const { email } = req.body;

    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    let user = await
        User.findOne({ email });
    if (!user) user = await
        User.create({ email });

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendEmail(email, otp);

    res.json({ message: "OTP sent to email" });
};

export const VerifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    const user = await
  user.findOne({ email });
  
    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
        return res.status(400).json({ error: "Invalid OTP" });
    }

    if (!user.trialStart) startTrial(user);

    const token =jwt.sign(
         { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
    res.json({ token });
};