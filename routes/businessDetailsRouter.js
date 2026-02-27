const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { 
    getBusinessDetails, 
    getBusinessDetail, 
    createBusinessDetails, 
    deleteBusinessDetails 
} = require('../controllers/businessDetailsController');
const { adminOnly } = require('../middlewares/adminAuth');

// Validation middleware
const businessDetailsValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('service').trim().notEmpty().withMessage('Service is required'),
    body('projectDetails').trim().notEmpty().withMessage('Project details are required')
];

const idValidation = [
    param('id').isMongoId().withMessage('Invalid business details ID')
];

// Routes
router.get('/',adminOnly, getBusinessDetails);
router.get('/:id',adminOnly, idValidation, getBusinessDetail);
router.post('/', businessDetailsValidation, createBusinessDetails);
router.delete('/:id',adminOnly, idValidation, deleteBusinessDetails);

module.exports = router;