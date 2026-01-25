import express from 'express';
import paypal from 'paypal-rest-sdk';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
paypal.configure({
    mode:Process.env.PAYPAL_MODE,
    client_id:Process.env.PAYPAL_CLIENT_ID,
    client_secret:Process.env.PAYPAL_CLIENT_SECRET
});

//create subscription
router.post('/create-subscription', authMiddleware, async (req, res) => {
    const UserId = req.user.id;
    const billingPlan = {
        name: "Awando Premium",
        description: "Premium subscription with 7-day free trial",
        type: "INFINITE",
        payment_definitions: [{
            name: "Standard Plan",
            type: "REGULAR",
            frequency: "MONTH",
            frequency_interval: "1",
            amount: {
                currency: "USD",
                value: "9.99",
                cycle: "0"
            }
        }],
        merchant_preferences: {
            auto_bill_amount: "YES",
            cancel_url: '${process.env.BASE_URL}/cancel',
            return_url: '${process.env.BASE_URL}/success',
            initial_fail_amount_action: "CONTINUE",
            max_fail_attempts: "0"
        }
    };
    paypal.billingPlan.create(billingPlan,(err, plan) => {
        if (err) return
        res.status(500).json({message: "paypal error", err})

        paypal.billingPlan.update(plan.id, [{op: "replace", path: "/", value: {state: "ACTIVE"}}], (err) => {
            if (err) return res.status(500).json({message: "paypal error", err})

                const startDate = new Date();
                startDate.setDate(startDate.getDate() + 1);

                const isoStart=startDate.toISOString().slice(0, 19) + 'Z';
                const agreement = {
                    name: "Awando Premium Subscription",
                    description: "Premium subscription with 7-day free trial",
                    start_date: isoStart,
                    plan: {id: plan.id},
                    payer: {payment_method: "paypal"}
                };
                paypal.billingAgreement.create(agreement, (err, agreement) => {
                    if (err) return res.status(500).json({message: "paypal error", err})

                        const approvalUrl = agreement.links.find(link => link.rel === 'approval_url').href;
                        res.json({approvalUrl});
                });
        });
    });
});
export default router;
