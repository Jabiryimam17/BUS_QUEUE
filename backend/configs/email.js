const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Uses admin email and app password from environment variables
// Required env vars:
// - ADMIN_EMAIL
// - ADMIN_APP_PASSWORD

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_APP_PASSWORD;

if (!adminEmail || !adminPassword) {
  console.warn(
    '[email] ADMIN_EMAIL or ADMIN_APP_PASSWORD is not set. Password reset emails will fail until configured.'
  );
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: adminEmail,
    pass: adminPassword
  }
});

async function send_reset_email(to, code) {
  if (!adminEmail || !adminPassword) {
    throw new Error('Email configuration is missing. Please set ADMIN_EMAIL and ADMIN_APP_PASSWORD.');
  }

  const mailOptions = {
    from: `"BusQueue Admin" <${adminEmail}>`,
    to,
    subject: 'BusQueue Password Reset Code',
    text: `Your BusQueue password reset code is: ${code}\n\nThis code will expire in 15 minutes.\n\nIf you did not request a password reset, please ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>BusQueue Password Reset</h2>
        <p>You requested to reset your BusQueue password.</p>
        <p>Your reset code is:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${code}</p>
        <p>This code will expire in <strong>15 minutes</strong>.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  send_reset_email
};

