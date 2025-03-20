const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const mustache = require("mustache");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASSWORD,
  },
});

// ✅ Load and render the Mustache template
function renderTemplate(templateName, data) {
  const templatePath = path.join(
    __dirname,
    "../templates",
    `${templateName}.mustache`
  );
  const template = fs.readFileSync(templatePath, "utf8");
  return mustache.render(template, data);
}

// ✅ Function to send emails
async function sendEmail(to, subject, templateName, templateData) {
  try {
    // Add the logo URL dynamically
    templateData.logoUrl =
      "https://uspark-media.s3.us-east-2.amazonaws.com/Logo.jpeg";

    const htmlContent = renderTemplate(templateName, templateData);

    const info = await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to,
      subject,
      html: htmlContent,
    });

    console.log(`📩 Email sent to ${to}: ${info.response}`);
  } catch (error) {
    console.error("❌ Email Sending Failed:", error.message);
  }
}

module.exports = { sendEmail };
