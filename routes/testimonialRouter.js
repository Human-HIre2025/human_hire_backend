const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const upload = require('../middlewares/multer');
const { 
    getTestimonials, 
    getTestimonial, 
    createTestimonial, 
    updateTestimonial, 
    deleteTestimonial 
} = require('../controllers/testimonialController');

// Validation middleware
const testimonialValidation = [
    body('review').trim().notEmpty().withMessage('Review is required'),
    body('authorName').trim().notEmpty().withMessage('Author name is required'),
    body('authorPosition').trim().notEmpty().withMessage('Author position is required')
];

const idValidation = [
    param('id').isMongoId().withMessage('Invalid testimonial ID')
];

// Routes
router.get('/', getTestimonials);
router.get('/:id', idValidation, getTestimonial);
router.post('/', upload.single('authorImg'), testimonialValidation, createTestimonial);
router.put('/:id', upload.single('authorImg'), [...idValidation, ...testimonialValidation], updateTestimonial);
router.delete('/:id', idValidation, deleteTestimonial);

module.exports = router;