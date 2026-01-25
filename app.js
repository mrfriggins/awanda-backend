import express from 'express';
import cors from 'cors';

import authroutes from "./routes/auth.routes.js";
import useroutes from "./routes/user.routes.js";
import paypalroutes from "./routes/paypal.routes.js";
import webhookroutes from "./routes/webhook.routes.js";
import airoutes from "./routes/ai.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authroutes);
app.use("/api/user", useroutes);
app.use("/api/paypal", paypalroutes);
app.use("/api/webhook", webhookroutes);
app.use("/api/ai", airoutes);

export default app;