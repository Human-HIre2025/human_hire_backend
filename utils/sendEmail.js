const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require('nodemailer');

// Email sending utility
const sendEmail = async (emailOptions) => {
  try {
    // Create a transporter (configure with your email service)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Example: Gmail; adjust for your provider
      auth: {
        user: process.env.EMAIL_SERVICE_ADMIN, // Service email for authentication
        pass: process.env.EMAIL_SERVICE_PASSWORD  // Service email password or app-specific password
      }
    });

    // Ensure emailOptions is an array
    const emails = Array.isArray(emailOptions) ? emailOptions : [emailOptions];

    // Send each email
    const results = await Promise.all(
      emails.map(async (options) => {
        console.log(`Attempting to send email to: ${options.to}`);
        try {
          const result = await transporter.sendMail({
            from: options.from,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html
          });
          console.log(`Successfully sent email to: ${options.to}`);
          return result;
        } catch (err) {
          console.error(`Failed to send email to ${options.to}:`, err);
          throw err;
        }
      })
    );

    console.log(`Successfully sent ${results.length} emails`);
    return { success: true, message: 'Emails sent successfully', results };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error(`Failed to send emails: ${error.message}`);
  }
};

module.exports = sendEmail;