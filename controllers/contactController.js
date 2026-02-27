const ContactUs = require('../models/contactModel');
const sendEmail = require('../utils/sendEmail');

// Get all contact submissions
exports.getContactSubmissions = async (req, res) => {
    try {
        const contacts = await ContactUs.find();
        res.status(200).json({
            success: true,
            data: contacts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Get single contact submission
exports.getContactSubmission = async (req, res) => {
    try {
        const contact = await ContactUs.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact submission not found'
            });
        }
        res.status(200).json({
            success: true,
            data: contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Create contact submission
exports.createContactSubmission = async (req, res) => {

    try {
        const { firstName, lastName, email, phone, subject, details } = req.body;
        const contact = new ContactUs({
            firstName,
            lastName,
            email,
            phone,
            subject,
            details
        });

        await contact.save();

        // Prepare email to muskan@humanhirecorp.com
        const notificationEmail = {
            from: process.env.EMAIL_SERVICE_ADMIN,
            to: process.env.MASTER_EMAIL,
            subject: `New Contact Form Submission: ${subject}`,
            text: `
                New Contact Form Submission:
                Name: ${firstName} ${lastName}
                Email: ${email} 
                Phone: ${phone}
                Subject: ${subject}
                Details: ${details}
            `,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Details:</strong> ${details}</p>
            `
        };

        // Send notification email
        await sendEmail(notificationEmail);

        res.status(201).json({
            success: true,
            data: contact,
            message: 'Contact submission saved and notification sent successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Validation Error or Email Sending Failed',
            error: error.message
        });
    }
};

// controllers/contactController.js
exports.respondToContactSubmission = async (req, res) => {
    try {
        let rawMessage = req.body.message;

        let message = "";

        if (typeof rawMessage === "string") {
            message = rawMessage;
        } else if (typeof rawMessage === "object") {
            message = rawMessage?.value || JSON.stringify(rawMessage);
        } else {
            message = String(rawMessage);
        }

        const { id } = req.params;
        const contact = await ContactUs.findById(id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact submission not found'
            });
        }

        const responseEmail = {
            from: process.env.EMAIL_SERVICE_ADMIN,
            to: contact.email,
            subject: `Re: ${contact.subject}`,
            text: `Hi ${contact.firstName},\n\n${message}\n\nRegards,\nHuman Hire Team`,
            html: `
                <p>Hi ${contact.firstName},</p>
                <p>${message}</p>
                <br>
                <p>Regards,<br>Human Hire Team</p>
            `
        };

        await sendEmail(responseEmail);

        contact.response = {
            message,
            respondedAt: new Date(),
            respondedBy: req.admin?.email || 'Admin'
        };
        await contact.save();

        res.status(200).json({
            success: true,
            message: 'Response sent and saved successfully',
            data: contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to send response',
            error: error.message
        });
    }
};

// Delete contact submission
exports.deleteContactSubmission = async (req, res) => {
    try {
        const contact = await ContactUs.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact submission not found'
            });
        }

        await contact.deleteOne();
        res.status(200).json({
            success: true,
            message: 'Contact submission deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};