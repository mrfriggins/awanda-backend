import express from 'express';
import bodyParser from 'body-parser';
import User from '../models/User.js';
const router = express.Router();

router.post('/paypal-webhook', bodyParser.json(), async (req, res) => {
    const event = req.body;
    try {
        if (["BILLING.SUBSCRIPTION.ACTIVATED", "PAYMENT.SALE.COMPLETED"].includes(event.event_type)) {
            const email = event.resource.subscriber.email_address;
            const user = await User.findOne({ email });
            if (user) {
                user.Premium = true;
                await user.save();
            }
        }
        res.status(200).send('RECEIVED');
    } catch (error) {
        console.error('Webhook error:',err),
        res.status(500).send('ERROR');
    }
});
export default router;