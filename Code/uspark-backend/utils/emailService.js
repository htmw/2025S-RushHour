const nodemailer = require("nodemailer");

// ✅ Define Admin Panel URL (Uses .env if available, otherwise defaults to localhost)
const ADMIN_PANEL_URL = process.env.ADMIN_PANEL_URL || "http://localhost:5173/admin";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// ✅ Configure Mail Transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL, // Set email from .env
    pass: process.env.ADMIN_PASSWORD, // Set password from .env
  },
});

// ✅ Function to Send Emails
async function sendEmail(to, subject, message) {
  try {
    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to,
      subject,
      html: message,
    });
    console.log(`📩 Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email Sending Failed:", error);
  }
}

module.exports = { sendEmail, ADMIN_EMAIL, ADMIN_PANEL_URL };

