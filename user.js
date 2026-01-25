import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: String,
    phone: String,
    otp: String,
    otpExpires: Date,

    role: { type: String, default: 'user' },

    trialStart: Date,
    trialEnd: Date,
    subscriptionStatus: {
        type: String,
        default: "trial"
    },
    paypalSubscriptionId: String,
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);                                                                                            