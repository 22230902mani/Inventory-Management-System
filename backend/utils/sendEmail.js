const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
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
        console.log(`✅ Reset Signal transmitted to: ${options.email}`);
    } catch (error) {
        console.error('❌ Email Alert Failed:', error.message);
        // During dev, keep printing to console so the user isn't stuck
        console.log('--- DEV FALLBACK MESSAGE ---');
        console.log(options.message);
        console.log('---------------------------');
        throw error; // Re-throw so the controller knows it failed
    }
};

module.exports = sendEmail;
