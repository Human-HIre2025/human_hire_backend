const JobApplication = require('../models/jobApplication');
const Job = require('../models/jobModel');
const sendEmail = require('../utils/sendEmail');

// Get all job applications
exports.getJobApplications = async (req, res) => {
    try {
        const jobApplications = await JobApplication.find().populate('jobId');
        res.status(200).json({
            success: true,
            data: jobApplications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Get job applications for a specific job
exports.getJobApplicationsByJob = async (req, res) => {
    try {
        const jobApplications = await JobApplication.find({ jobId: req.params.jobId }).populate('jobId');
        res.status(200).json({
            success: true,
            data: jobApplications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Get single job application
exports.getJobApplication = async (req, res) => {
    try {
        const jobApplication = await JobApplication.findById(req.params.id).populate('jobId');
        if (!jobApplication) {
            return res.status(404).json({
                success: false,
                message: 'Job application not found'
            });
        }
        res.status(200).json({
            success: true,
            data: jobApplication
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Create job application
exports.createJobApplication = async (req, res) => {
    try {
        const { jobId, candidateDetails } = req.body;
        const jobApplication = new JobApplication({
            jobId,
            candidateDetails
        });

        await jobApplication.save();

        // Fetch job details for email
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Prepare email to HR
        const hrEmail = {
            from: process.env.EMAIL_SERVICE_ADMIN,
            to: 'hr@humanhirecorp.com',
            subject: `New Job Application for ${job.title}`,
            text: `
                New Job Application Received:
                Job Title: ${job.title}
                Candidate Name: ${candidateDetails.name}
                Email: ${candidateDetails.email}
                Phone: ${candidateDetails.phone}
                Address: ${candidateDetails.address}
                Profession: ${candidateDetails.profession}
                Experience: ${candidateDetails.experience}
                Current CTC: ${candidateDetails.currentCTC}
                Expected CTC: ${candidateDetails.expectedCTC}
            `,
            html: `
                <h2>New Job Application Received</h2>
                <p><strong>Job Title:</strong> ${job.title}</p>
                <p><strong>Candidate Name:</strong> ${candidateDetails.name}</p>
                <p><strong>Email:</strong> ${candidateDetails.email}</p>
                <p><strong>Phone:</strong> ${candidateDetails.phone}</p>
                <p><strong>Address:</strong> ${candidateDetails.address}</p>
                <p><strong>Profession:</strong> ${candidateDetails.profession}</p>
                <p><strong>Experience:</strong> ${candidateDetails.experience}</p>
                <p><strong>Current CTC:</strong> ${candidateDetails.currentCTC}</p>
                <p><strong>Expected CTC:</strong> ${candidateDetails.expectedCTC}</p>
            `
        };

        // Prepare email to candidate
        const candidateEmail = {
            from: process.env.EMAIL_SERVICE_ADMIN,
            to: candidateDetails.email,
            subject: 'Job Application Submitted Successfully',
            text: `
                Dear ${candidateDetails.name},
                
                Thank you for applying for the ${job.title} position at HumanHireCorp. We have successfully received your application. Our HR team will review your details and get back to you soon.
                
                Best regards,
                HumanHireCorp Team
            `,
            html: `
                <h2>Application Submitted Successfully</h2>
                <p>Dear ${candidateDetails.name},</p>
                <p>Thank you for applying for the <strong>${job.title}</strong> position at HumanHireCorp. We have successfully received your application. Our HR team will review your details and get back to you soon.</p>
                <p>Best regards,<br>HumanHireCorp Team</p>
            `
        };

        // Send both emails
        await sendEmail([hrEmail, candidateEmail]);

        res.status(201).json({
            success: true,
            data: jobApplication,
            message: 'Job application submitted successfully, emails sent to HR and candidate'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Validation Error or Email Sending Failed',
            error: error.message
        });
    }
};

// Delete job application
exports.deleteJobApplication = async (req, res) => {
    try {
        const jobApplication = await JobApplication.findById(req.params.id);
        if (!jobApplication) {
            return res.status(404).json({
                success: false,
                message: 'Job application not found'
            });
        }

        await jobApplication.deleteOne();
        res.status(200).json({
            success: true,
            message: 'Job application deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};