const Testimonial = require('../models/testimonialModel');
const { storeOnCloudinary, validateImage, deleteFromCloudinary } = require('../utils/imageUtils');

// Get all testimonials
exports.getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find();
        res.status(200).json({
            success: true,
            data: testimonials
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Get single testimonial
exports.getTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found'
            });
        }
        res.status(200).json({
            success: true,
            data: testimonial
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Create testimonial
exports.createTestimonial = async (req, res) => {
    try {
        const { review, authorName, authorPosition } = req.body;
        let authorImgPath = '';

        if (req.file) {
            validateImage(req.file);
            authorImgPath = await storeOnCloudinary(req.file);
        }

        const testimonial = new Testimonial({
            review,
            authorImg: authorImgPath,
            authorName,
            authorPosition
        });

        await testimonial.save();
        res.status(201).json({
            success: true,
            data: testimonial
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Validation Error',
            error: error.message
        });
    }
};

// Update testimonial
exports.updateTestimonial = async (req, res) => {
    try {
        const { review, authorName, authorPosition } = req.body;
        const testimonial = await Testimonial.findById(req.params.id);

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found'
            });
        }

        // Store old author image URL for potential cleanup
        const oldAuthorImgUrl = testimonial.authorImg;

        if (req.file) {
            validateImage(req.file);
            const authorImgPath = await storeOnCloudinary(req.file);
            testimonial.authorImg = authorImgPath;

            // Delete old author image from Cloudinary if it exists and is different from new one
            if (oldAuthorImgUrl && oldAuthorImgUrl !== authorImgPath) {
                try {
                    await deleteFromCloudinary(oldAuthorImgUrl);
                } catch (deleteError) {
                    console.error('Error deleting old author image from Cloudinary:', deleteError);
                    // Continue with the update even if image deletion fails
                }
            }
        }

        testimonial.review = review || testimonial.review;
        testimonial.authorName = authorName || testimonial.authorName;
        testimonial.authorPosition = authorPosition || testimonial.authorPosition;

        await testimonial.save();
        res.status(200).json({
            success: true,
            data: testimonial
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Validation Error',
            error: error.message
        });
    }
};

// Delete testimonial
exports.deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found'
            });
        }

        // Delete author image from Cloudinary if it exists
        if (testimonial.authorImg) {
            try {
                await deleteFromCloudinary(testimonial.authorImg);
            } catch (deleteError) {
                console.error('Error deleting author image from Cloudinary:', deleteError);
                // Continue with testimonial deletion even if image deletion fails
            }
        }

        await testimonial.deleteOne();
        res.status(200).json({
            success: true,
            message: 'Testimonial deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};