import nodemailer from 'nodemailer';

export const sendEmail = async (to, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `Awando Worldwide <${process.env.EMAIL_USER}>`,
        to,
        subject:  "your Awando verification code",
        text: `Your 6-digit verification code is: ${otp}`,

    });
}