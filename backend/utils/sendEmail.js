// utils/sendEmail.js
import nodemailer from 'nodemailer';

let transporter;

const createTransporter = () => {
  if (transporter) return transporter;

  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT) || 587;
  const secure = process.env.EMAIL_SECURE === 'true';
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const from = process.env.EMAIL_FROM;
  const fromName = process.env.EMAIL_FROM_NAME;

  if (!host || !port || !user || !pass || !from || !fromName) {
    throw new Error(
      'Missing email configuration. Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM, and EMAIL_FROM_NAME in environment variables.'
    );
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    pool: true,
    maxConnections: 3,
    maxMessages: 100,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    tls: {
      rejectUnauthorized: false
    }
  });

  transporter.verify((error, success) => {
    if (error) {
      console.error('Email transporter verification failed:', error);
    } else {
      console.log('Email transporter is ready to send messages');
    }
  });

  return transporter;
};

const sendEmail = async (to, subject, text, html) => {
  try {
    const transport = createTransporter();

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      text
    };

    if (html) mailOptions.html = html;

    console.log('Sending email to:', to, 'subject:', subject);
    const info = await transport.sendMail(mailOptions);

    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    if (error.response) {
      console.error('SMTP response:', error.response);
    }
    if (error.code) {
      console.error('SMTP error code:', error.code);
    }
    throw new Error('Failed to send email');
  }
};

export default sendEmail;