const TeamMember = require('../models/teamMemberModel');
const { storeOnCloudinary, validateImage, deleteFromCloudinary } = require('../utils/imageUtils');

// Get all team members
exports.getTeamMembers = async (req, res) => {
    try {
        const teamMembers = await TeamMember.find();
        res.status(200).json({
            success: true,
            data: teamMembers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Get single team member
exports.getTeamMember = async (req, res) => {
    try {
        const teamMember = await TeamMember.findById(req.params.id);
        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: 'Team member not found'
            });
        }
        res.status(200).json({
            success: true,
            data: teamMember
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Create team member
exports.createTeamMember = async (req, res) => {
    try {
        const { name, position, description, isFeatured } = req.body;
        let imagePath = '';

        if (req.file) {
            validateImage(req.file);
            imagePath = await storeOnCloudinary(req.file);
        }

        const teamMember = new TeamMember({
            name,
            position,
            image: imagePath,
            description,
            isFeatured: isFeatured === 'true' || isFeatured === true
        });

        await teamMember.save();
        res.status(201).json({
            success: true,
            data: teamMember
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Validation Error',
            error: error.message
        });
    }
};

// Update team member
exports.updateTeamMember = async (req, res) => {
    try {
        const { name, position, description, isFeatured } = req.body;
        const teamMember = await TeamMember.findById(req.params.id);

        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: 'Team member not found'
            });
        }

        // Store old image URL for potential cleanup
        const oldImageUrl = teamMember.image;

        if (req.file) {
            validateImage(req.file);
            const imagePath = await storeOnCloudinary(req.file);
            teamMember.image = imagePath;

            // Delete old image from Cloudinary if it exists and is different from new one
            if (oldImageUrl && oldImageUrl !== imagePath) {
                try {
                    await deleteFromCloudinary(oldImageUrl);
                } catch (deleteError) {
                    console.error('Error deleting old image from Cloudinary:', deleteError);
                    // Continue with the update even if image deletion fails
                }
            }
        }

        teamMember.name = name || teamMember.name;
        teamMember.position = position || teamMember.position;
        teamMember.description = description || teamMember.description;
        teamMember.isFeatured = isFeatured !== undefined ? isFeatured === 'true' || isFeatured === true : teamMember.isFeatured;

        await teamMember.save();
        res.status(200).json({
            success: true,
            data: teamMember
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Validation Error',
            error: error.message
        });
    }
};

// Delete team member
exports.deleteTeamMember = async (req, res) => {
    try {
        const teamMember = await TeamMember.findById(req.params.id);
        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: 'Team member not found'
            });
        }

        // Delete image from Cloudinary if it exists
        if (teamMember.image) {
            try {
                await deleteFromCloudinary(teamMember.image);
            } catch (deleteError) {
                console.error('Error deleting image from Cloudinary:', deleteError);
                // Continue with team member deletion even if image deletion fails
            }
        }

        await teamMember.deleteOne();
        res.status(200).json({
            success: true,
            message: 'Team member deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Get featured team members
exports.getFeaturedTeamMembers = async (req, res) => {
    try {
        const featuredMembers = await TeamMember.find({ isFeatured: true });
        res.status(200).json({
            success: true,
            data: featuredMembers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};