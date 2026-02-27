const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const upload = require('../middlewares/multer');
const { 
    getClients, 
    getClient, 
    createClient, 
    updateClient, 
    deleteClient 
} = require('../controllers/clientController');

// Validation middleware
const clientValidation = [
    body('clientName').trim().notEmpty().withMessage('Client name is required')
];

const idValidation = [
    param('id').isMongoId().withMessage('Invalid client ID')
];

// Routes
router.get('/', getClients);
router.get('/:id', idValidation, getClient);
router.post('/', upload.single('logo'), clientValidation, createClient);
router.put('/:id', upload.single('logo'), [...idValidation, ...clientValidation], updateClient);
router.delete('/:id', idValidation, deleteClient);

module.exports = router;