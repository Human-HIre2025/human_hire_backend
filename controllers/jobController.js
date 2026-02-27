const Job = require('../models/jobModel');

// Get all jobs
exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json({
            success: true,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Get single job
exports.getJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }
        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Create job
exports.createJob = async (req, res) => {
    try {
        const { title, location, description } = req.body;
        const job = new Job({
            title,
            location,
            description
        });

        await job.save();
        res.status(201).json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Validation Error',
            error: error.message
        });
    }
};

// Update job
exports.updateJob = async (req, res) => {
    try {
        const { title, location, description } = req.body;
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        job.title = title || job.title;
        job.location = location || job.location;
        job.description = description || job.description;

        await job.save();
        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Validation Error',
            error: error.message
        });
    }
};

// Delete job
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        await job.deleteOne();
        res.status(200).json({
            success: true,
            message: 'Job deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};