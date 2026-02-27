const cloudinary = require('cloudinary').v2;
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();
// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storeOnCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        try {
            // Generate unique filename
            const fileExtension = getExtensionFromMimetype(file.mimetype);
            const uniqueName = crypto.randomUUID();
            
            // Upload to Cloudinary
            cloudinary.uploader.upload_stream(
                {
                    resource_type: 'auto',
                    public_id: uniqueName,
                    folder: 'uploads', // Optional: organize files in a folder
                    format: fileExtension.replace('.', ''), // Remove dot from extension
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        // Return the complete Cloudinary URL
                        resolve(result.secure_url);
                    }
                }
            ).end(file.buffer);

        } catch (error) {
            reject(error);
        }
    });
};

// Delete function for Cloudinary
const deleteFromCloudinary = (publicId) => {
    return new Promise((resolve, reject) => {
        try {
            // Extract public_id from URL if a full URL is provided
            let extractedPublicId = publicId;
            
            if (publicId.includes('cloudinary.com')) {
                // Extract public_id from Cloudinary URL
                const urlParts = publicId.split('/');
                const uploadIndex = urlParts.findIndex(part => part === 'upload');
                if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
                    // Get everything after version (v1234567890)
                    const pathAfterVersion = urlParts.slice(uploadIndex + 2).join('/');
                    // Remove file extension
                    extractedPublicId = pathAfterVersion.replace(/\.[^/.]+$/, '');
                }
            }

            cloudinary.uploader.destroy(extractedPublicId, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });

        } catch (error) {
            reject(error);
        }
    });
};

// Helper function to get file extension from mimetype
const getExtensionFromMimetype = (mimetype) => {
    const mimeToExt = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'image/webp': '.webp',
        'image/svg+xml': '.svg',
        'application/pdf': '.pdf',
        'video/mp4': '.mp4',
        'video/webm': '.webm',
        'video/quicktime': '.mov'
    };
    return mimeToExt[mimetype] || '.jpg';
};

const validateImage = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB (Cloudinary free tier allows up to 10MB)

    if (!allowedTypes.includes(file.mimetype)) {
        throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
    }

    if (file.size > maxSize) {
        throw new Error('File size too large. Maximum size is 10MB.');
    }

    return true;
};

module.exports = {
    storeOnCloudinary, // Keeping the same function name for compatibility
    deleteFromCloudinary,
    validateImage,
};