const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { register, login, logout, getAdmin, createAdmin, deleteAdmin, getAllAdmins } = require('../controllers/adminAuthController');
const { adminOnly, superadminOnly } = require('../middlewares/adminAuth');

// Validation middlewares
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// Register admin route with validation
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  validate,
  register
);

// Login admin route with validation
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  validate,
  login
);

// Create admin (superadmin only)
router.post(
  '/create-admin',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  validate,
  adminOnly,
  superadminOnly,
  createAdmin
);

// Delete admin (superadmin only)
router.delete(
  '/delete-admin/:id',
  adminOnly,
  superadminOnly,
  deleteAdmin
);

// Get all admins (superadmin only)
router.get('/admins', adminOnly, superadminOnly, getAllAdmins);


// Protected routes
router.get('/logout', adminOnly, logout);
router.get('/profile', adminOnly, getAdmin);

module.exports = router;