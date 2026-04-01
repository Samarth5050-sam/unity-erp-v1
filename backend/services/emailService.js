const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    // For production, the user needs to provide SMTP details in .env
    // Defaulting to a placeholder configuration
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'samarthrshinde5050@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});

const sendInvoiceEmail = async (to, subject, text, html, attachments = []) => {
    try {
        const mailOptions = {
            from: `"Unity Electronics" <${process.env.EMAIL_USER || 'samarthrshinde5050@gmail.com'}>`,
            to,
            subject,
            text,
            html,
            attachments
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        // Don't throw error to prevent sale failure, just log it
        return null;
    }
};

module.exports = { sendInvoiceEmail };
