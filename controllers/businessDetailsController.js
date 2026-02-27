const BusinessDetails = require('../models/businessDetails');
const sendEmail = require('../utils/sendEmail');

// Get all business details submissions
exports.getBusinessDetails = async (req, res) => {
    try {
        const businessDetails = await BusinessDetails.find();
        res.status(200).json({
            success: true,
            data: businessDetails
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Get single business details submission
exports.getBusinessDetail = async (req, res) => {
    try {
        const businessDetail = await BusinessDetails.findById(req.params.id);
        if (!businessDetail) {
            return res.status(404).json({
                success: false,
                message: 'Business details not found'
            });
        }
        res.status(200).json({
            success: true,
            data: businessDetail
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Create business details submission
exports.createBusinessDetails = async (req, res) => {
    try {
        const { name, phone, email, service, projectDetails } = req.body;
        const businessDetail = new BusinessDetails({
            name,
            phone,
            email,
            service,
            projectDetails
        });

        await businessDetail.save();

        // Prepare email to muskan@humanhirecorp.com
        const notificationEmail = {
            from: process.env.EMAIL_SERVICE_ADMIN,
            to: process.env.MASTER_EMAIL,
            subject: `New Business Details Submission: ${service}`,
            text: `
                New Business Details Submission:
                Name: ${name}
                Email: ${email}
                Phone: ${phone}
                Service: ${service}
                Project Details: ${projectDetails}
            `,
            html: `
                <h2>New Business Details Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Service:</strong> ${service}</p>
                <p><strong>Project Details:</strong> ${projectDetails}</p>
            `
        };

        // Send notification email
        await sendEmail(notificationEmail);

        res.status(201).json({
            success: true,
            data: businessDetail,
            message: 'Business details submitted and notification sent successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Validation Error or Email Sending Failed',
            error: error.message
        });
    }
};

// Delete business details submission
exports.deleteBusinessDetails = async (req, res) => {
    try {
        const businessDetail = await BusinessDetails.findById(req.params.id);
        if (!businessDetail) {
            return res.status(404).json({
                success: false,
                message: 'Business details not found'
            });
        }

        await businessDetail.deleteOne();
        res.status(200).json({
            success: true,
            message: 'Business details deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};