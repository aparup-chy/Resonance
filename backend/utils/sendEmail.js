// utils/sendEmail.js
import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, text, html) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Send email (use html when provided)
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      text
    };

    if (html) mailOptions.html = html;

    const info = await transporter.sendMail(mailOptions);

    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send email');
  }
};

export default sendEmail;