const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { 
    getJobApplications, 
    getJobApplicationsByJob,
    getJobApplication, 
    createJobApplication, 
    deleteJobApplication 
} = require('../controllers/jobApplicationController');
const { adminOnly } = require('../middlewares/adminAuth');

// Validation middleware
const jobApplicationValidation = [
    body('jobId').isMongoId().withMessage('Invalid job ID'),
    body('candidateDetails.name').trim().notEmpty().withMessage('Candidate name is required'),
    body('candidateDetails.email').isEmail().withMessage('Valid email is required'),
    body('candidateDetails.phone').trim().notEmpty().withMessage('Phone number is required'),
    body('candidateDetails.address').trim().notEmpty().withMessage('Address is required'),
    body('candidateDetails.profession').trim().notEmpty().withMessage('Profession is required'),
    body('candidateDetails.experience').trim().notEmpty().withMessage('Experience is required'),
    body('candidateDetails.currentCTC').trim().notEmpty().withMessage('Current CTC is required'),
    body('candidateDetails.expectedCTC').trim().notEmpty().withMessage('Expected CTC is required')
];

const idValidation = [
    param('id').isMongoId().withMessage('Invalid job application ID')
];

const jobIdValidation = [
    param('jobId').isMongoId().withMessage('Invalid job ID')
];

// Routes
router.get('/', adminOnly, getJobApplications);
router.get('/job/:jobId',adminOnly ,  jobIdValidation, getJobApplicationsByJob);
router.get('/:id',adminOnly ,  idValidation, getJobApplication);
router.post('/', jobApplicationValidation, createJobApplication);
router.delete('/:id', idValidation, deleteJobApplication);

module.exports = router;