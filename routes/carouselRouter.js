const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const upload = require('../middlewares/multer');
const { 
    getCarousel, 
    uploadCarouselImage, 
    deleteCarouselImage,
    getCarouselImagesByType 
} = require('../controllers/carouselController');
const { adminOnly } = require('../middlewares/adminAuth');

// Validation middleware
const imageValidation = [
    body('type').trim().notEmpty().withMessage('Type is required')
        .isIn(['team', 'event']).withMessage('Type must be one of: team, event'),
    body('text').optional().trim()
];

const typeValidation = [
    param('type').trim().notEmpty().withMessage('Type is required')
        .isIn(['team', 'event']).withMessage('Type must be one of: team, event')
];

const imageIdValidation = [
    param('imageId').isMongoId().withMessage('Invalid image ID')
];

// Routes
router.get('/', adminOnly ,  getCarousel);
router.get('/type/:type', typeValidation, getCarouselImagesByType);
router.post('/image', upload.single('image'),adminOnly ,  imageValidation, uploadCarouselImage);
router.delete('/image/:imageId',adminOnly ,  imageIdValidation, deleteCarouselImage);

module.exports = router;