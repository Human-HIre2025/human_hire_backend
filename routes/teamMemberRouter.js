const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const upload = require('../middlewares/multer');
const { 
    getTeamMembers, 
    getTeamMember, 
    createTeamMember, 
    updateTeamMember, 
    deleteTeamMember,
    getFeaturedTeamMembers 
} = require('../controllers/teamMemberController');

// Validation middleware
const teamMemberValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('position').trim().notEmpty().withMessage('Position is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean')
];

const idValidation = [
    param('id').isMongoId().withMessage('Invalid team member ID')
];

// Routes
router.get('/', getTeamMembers);
router.get('/featured', getFeaturedTeamMembers);
router.get('/:id', idValidation, getTeamMember);
router.post('/', upload.single('image'), teamMemberValidation, createTeamMember);
router.put('/:id', upload.single('image'), [...idValidation, ...teamMemberValidation], updateTeamMember);
router.delete('/:id', idValidation, deleteTeamMember);

module.exports = router;