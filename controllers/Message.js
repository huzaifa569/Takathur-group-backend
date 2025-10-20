import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  runtime: "nodejs20.x" 
};

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

export const messageController = {
  sendMessage: async (req, res) => {
    try {
      console.log("API Hit:", req.body);

      const { fullName, email, phoneNumber, companyName, serviceInterestedIn, projectDetails } = req.body;

      if (!fullName || !email || !projectDetails) {
        return res.status(400).json({ success: false, message: 'Required fields missing' });
      }

      const transporter = createTransporter();

      try {
        await transporter.verify();
        console.log('SMTP Verified Successfully');
      } catch (verifyError) {
        console.log('SMTP Verification Failed:', verifyError.message);
      }

      const mailOptions = {
        from:  process.env.SMTP_USER,
        to:  process.env.SMTP_USER, 
        replyTo: email,
        subject: `New Service Inquiry - ${serviceInterestedIn || 'General'}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>New Service Inquiry</h2>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phoneNumber || 'Not provided'}</p>
            <p><strong>Company:</strong> ${companyName || 'Not provided'}</p>
            <p><strong>Service Interested In:</strong> ${serviceInterestedIn || 'Not specified'}</p>
            <p><strong>Project Details:</strong> ${projectDetails}</p>
          </div>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email Sent:", info.messageId);

      return res.status(200).json({ success: true, message: 'Message sent successfully' });

    } catch (error) {
      console.error("Controller Crash:", error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal Server Error',
        error: error.message 
      });
    }
  }
};