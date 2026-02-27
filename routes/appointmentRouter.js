const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { 
    getAppointments, 
    getAppointment, 
    createAppointment, 
    deleteAppointment 
} = require('../controllers/appointmentController');

// Validation middleware
const appointmentValidation = [
    body('service').trim().notEmpty().withMessage('Service is required'),
    body('date').trim().notEmpty().withMessage('Date is required')
        .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format'),
    body('timeSlot').trim().notEmpty().withMessage('Time slot is required'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required')
];

const idValidation = [
    param('id').isMongoId().withMessage('Invalid appointment ID')
];

// Routes
router.get('/', getAppointments);
router.get('/:id', idValidation, getAppointment);
router.post('/', appointmentValidation, createAppointment);
router.delete('/:id', idValidation, deleteAppointment);

module.exports = router;