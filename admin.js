const express = require("express");
const router = express.Router();
const User = require("../models/User");
// ADMIN AUTH (simple but effective)
function adminAuth(req, res, next) {
const { email, password } = req.headers;
if (
email === process.env.ADMIN_EMAIL &&
password === process.env.ADMIN_PASSWORD
) {
next();
} else {
return res.status(403).json({ message: "Unauthorized" });
}
}
/* �� ADMIN DASHBOARD */
router.get("/dashboard", adminAuth, async (req, res) => {
const members = await User.countDocuments({ role: "user" });
const revenueData = await User.aggregate([
{ $match: { subscriptionPaid: true } },
{ $group: { _id: null, total: { $sum: "$subscriptionAmount" } } }
]);
const totalRevenue = revenueData[0]?.total || 0;
res.json({
members,
totalRevenue
});
});
/* �� WITHDRAW (SIMULATED PAYOUT) */
router.post("/withdraw", adminAuth, async (req, res) => {
const { amount, paypalEmail } = req.body;
if (!amount || !paypalEmail) {
return res.status(400).json({ message: "Missing details" });
}
// REAL PAYOUTS REQUIRE PAYPAL Payouts API
res.json({
success: true,
message: `Withdrawal of $${amount} sent to ${paypalEmail}`
});
});
module.exports = router;