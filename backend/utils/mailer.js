const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendMail({ to, subject, html, text }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP credentials not configured; skipping email send');
    return { skipped: true };
  }

  const from = process.env.SMTP_FROM || 'Lunel <no-reply@lunel.com>';
  const info = await transporter.sendMail({ from, to, subject, html, text });
  return info;
}

module.exports = { sendMail };


