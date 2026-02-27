const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { 
    getJobs, 
    getJob, 
    createJob, 
    updateJob, 
    deleteJob 
} = require('../controllers/jobController');
const { adminOnly } = require('../middlewares/adminAuth');

// Validation middleware
const jobValidation = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('description').trim().notEmpty().withMessage('Description is required')
];

const idValidation = [
    param('id').isMongoId().withMessage('Invalid job ID')
];

// Routes
router.get('/', getJobs);
router.get('/:id', idValidation, getJob);
router.post('/',adminOnly ,  jobValidation, createJob);
router.put('/:id',adminOnly ,  [...idValidation, ...jobValidation], updateJob);
router.delete('/:id',adminOnly , idValidation, deleteJob);

module.exports = router;