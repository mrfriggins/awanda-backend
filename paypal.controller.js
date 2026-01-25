import fetch from 'node-fetch';

export const createSubscription = async (req, res) => {
    const token = await getPaypalToken();

    const response = await fetch('${process.env.PAYPAL_API_BASE}/v1/billing/subscriptions',
         {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            plan_id:
    process.env.PAYPAL_PLAN_ID,
          })
        }
    );
    const data = await response.json();
    res.json(data);
};

async function getPaypalToken() {
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
    const res = await fetch('${process.env.PAYPAL_API_BASE}/v1/oauth2/token',
         {
        method: 'POST',
        headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    }
);
    const data = await res.json();
    return data.access_token;
}
