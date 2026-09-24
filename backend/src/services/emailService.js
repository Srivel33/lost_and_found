import nodemailer from 'nodemailer';

// Mock transporter using Ethereal (or simply console.log for hackathon)
let transporter;

const initTransporter = async () => {
  if (transporter) return;
  // In production, configure SMTP (e.g. Amazon SES, SendGrid, etc.)
  // For this prototype, we'll use a local mock or Ethereal
  try {
    const account = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });
    console.log('[EmailService] Nodemailer initialized with Ethereal test account.');
  } catch (err) {
    console.error('Failed to init Ethereal transporter:', err);
  }
};

export const sendMatchAlertEmail = async (userEmail, userName, lostItemName, matchScore) => {
  if (!transporter) await initTransporter();
  
  if (!userEmail) return;

  const mailOptions = {
    from: '"Campus Lost & Found" <noreply@campus.edu>',
    to: userEmail, // typically @snsct.org or @college.edu
    subject: `Found a potential match for your ${lostItemName}!`,
    text: `Hello ${userName},\n\nWe found a potential match for your reported lost item "${lostItemName}" with a confidence score of ${matchScore}.\n\nPlease log in to the Campus Lost & Found portal to review and verify the match.\n\nBest,\nCampus Security Desk`,
    html: `<p>Hello ${userName},</p><p>We found a potential match for your reported lost item "<strong>${lostItemName}</strong>" with a confidence score of ${matchScore}.</p><p>Please log in to the Campus Lost & Found portal to review and verify the match.</p><p>Best,<br>Campus Security Desk</p>`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Match alert sent to ${userEmail}. Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  } catch (err) {
    console.error('[EmailService] Failed to send email:', err);
  }
};
