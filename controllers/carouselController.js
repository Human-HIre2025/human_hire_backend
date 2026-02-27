const CarouselModel = require('../models/carouselModel'); // ✅ Match file name
const { storeOnCloudinary, validateImage, deleteFromCloudinary } = require('../utils/imageUtils');

// Get carousel
exports.getCarousel = async (req, res) => {
    try {
        const carousel = await CarouselModel.findOne();
        if (!carousel) {
            // If no carousel exists, create a default one
            const defaultCarousel = new CarouselModel({ images: [] });
            await defaultCarousel.save();
            return res.status(200).json({
                success: true,
                data: defaultCarousel
            });
        }
        res.status(200).json({
            success: true, //sucess
            data: carousel
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Upload image to carousel
exports.uploadCarouselImage = async (req, res) => {
    try {
        const { type, text } = req.body;

        // Check for required image file
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Image file is required',
            });
        }

        // Validate image before database operations
        validateImage(req.file);

        // Find or create carousel document
        let carousel = await CarouselModel.findOne();
        if (!carousel) {
            // console.log('No existing carousel found, creating a new one');
            carousel = new CarouselModel({ images: [] });
        }

        // Store image on server
        const imageUrl = await storeOnCloudinary(req.file);
        // console.log('Image stored at:', imageUrl);

        // Add new image data
        carousel.images.push({ type, text, imageUrl });

        await carousel.save();

        return res.status(201).json({
            success: true,
            message: 'Carousel image uploaded successfully',
            data: carousel,
        });

    } catch (error) {
        console.error('Error in uploadCarouselImage:', error.message);
        return res.status(400).json({
            success: false,
            message: 'Image upload failed due to validation or server error',
            error: error.message,
        });
    }
};

// Delete image from carousel
exports.deleteCarouselImage = async (req, res) => {
    try {
        const { imageId } = req.params;
        const carousel = await CarouselModel.findOne();
        if (!carousel) {
            return res.status(404).json({
                success: false,
                message: 'Carousel not found'
            });
        }

        const image = carousel.images.id(imageId);
        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        // Delete image from Cloudinary if it exists
        if (image.imageUrl) {
            try {
                await deleteFromCloudinary(image.imageUrl);
            } catch (deleteError) {
                console.error('Error deleting image from Cloudinary:', deleteError);
                // Continue with database deletion even if Cloudinary deletion fails
            }
        }

        carousel.images.pull(imageId);
        await carousel.save();

        res.status(200).json({
            success: true,
            message: 'Image deleted successfully',
            data: carousel
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Delete all images from carousel (optional utility function)
exports.deleteAllCarouselImages = async (req, res) => {
    try {
        const carousel = await CarouselModel.findOne();
        if (!carousel) {
            return res.status(404).json({
                success: false,
                message: 'Carousel not found'
            });
        }

        // Delete all images from Cloudinary
        const deletePromises = carousel.images.map(async (image) => {
            if (image.imageUrl) {
                try {
                    await deleteFromCloudinary(image.imageUrl);
                } catch (deleteError) {
                    console.error('Error deleting image from Cloudinary:', deleteError);
                }
            }
        });

        // Wait for all deletions to complete (or fail)
        await Promise.allSettled(deletePromises);

        // Clear all images from database
        carousel.images = [];
        await carousel.save();

        res.status(200).json({
            success: true,
            message: 'All carousel images deleted successfully',
            data: carousel
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Delete images by type
exports.deleteCarouselImagesByType = async (req, res) => {
    try {
        const { type } = req.params;
        const carousel = await CarouselModel.findOne();
        if (!carousel) {
            return res.status(404).json({
                success: false,
                message: 'Carousel not found'
            });
        }

        // Find images of the specified type
        const imagesToDelete = carousel.images.filter(img => img.type === type);
        
        if (imagesToDelete.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No images found with type: ${type}`
            });
        }

        // Delete images from Cloudinary
        const deletePromises = imagesToDelete.map(async (image) => {
            if (image.imageUrl) {
                try {
                    await deleteFromCloudinary(image.imageUrl);
                } catch (deleteError) {
                    console.error('Error deleting image from Cloudinary:', deleteError);
                }
            }
        });

        // Wait for all deletions to complete (or fail)
        await Promise.allSettled(deletePromises);

        // Remove images of the specified type from database
        carousel.images = carousel.images.filter(img => img.type !== type);
        await carousel.save();

        res.status(200).json({
            success: true,
            message: `Images with type '${type}' deleted successfully`,
            data: carousel
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Get images by type
exports.getCarouselImagesByType = async (req, res) => {
    try {
        const { type } = req.params;
        const carousel = await CarouselModel.findOne();
        if (!carousel) {
            return res.status(404).json({
                success: false,
                message: 'Carousel not found'
            });
        }

        const images = carousel.images.filter(img => img.type === type);
        res.status(200).json({
            success: true,
            data: images
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};