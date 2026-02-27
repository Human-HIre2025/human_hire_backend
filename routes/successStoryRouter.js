const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { 
    getSuccessStoriesByType,
    createStory,
    updateStory,
    deleteStory,
    getAllSuccessStory
} = require('../controllers/successStoryController');
const { adminOnly } = require('../middlewares/adminAuth');


// Validation middleware for single story
const singleStoryValidation = [
    body('testimonial.review').trim().notEmpty().withMessage('Testimonial review is required'),
    body('testimonial.author').trim().notEmpty().withMessage('Testimonial author is required'),
    body('clientInfo.client').trim().notEmpty().withMessage('Client name is required'),
    body('clientInfo.industry').trim().notEmpty().withMessage('Client industry is required'),
    body('clientInfo.region').trim().notEmpty().withMessage('Client region is required')
];

const idValidation = [
    param('id').isMongoId().withMessage('Invalid success story type ID')
];

const typeValidation = [
    param('type').trim().notEmpty().withMessage('Type is required')
        .isIn(['recruitment', 'marketing', 'healthcare']).withMessage('Type must be one of: recruitment, marketing, healthcare')
];

const storyIdValidation = [
    param('storyId').isMongoId().withMessage('Invalid story ID')
];

// Routes
router.get('/', getAllSuccessStory);
router.get('/type/:type', typeValidation, getSuccessStoriesByType);

// New routes for single story operations
router.post('/type/:type/story', [...typeValidation, ...singleStoryValidation], adminOnly , createStory);
router.put('/type/:type/story/:storyId', [...typeValidation, ...storyIdValidation, ...singleStoryValidation], adminOnly ,  updateStory);
router.delete('/type/:type/story/:storyId', [...typeValidation, ...storyIdValidation],adminOnly ,  deleteStory);

module.exports = router;