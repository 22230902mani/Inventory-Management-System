const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or configured host
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const message = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    try {
        await transporter.sendMail(message);
        console.log('Email sent to: ' + options.email);
    } catch (error) {
        console.error('Email send failed:', error);
        // In dev, we might just log it so the flow continues
        console.log('DEV MODE - MESSAGE:', options.message);
    }
};

module.exports = sendEmail;
