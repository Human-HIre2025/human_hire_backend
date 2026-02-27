const express = require('express');
const router = express.Router();
const { getDashboard, refreshDashboard } = require('../controllers/dashboardController');
const { adminOnly, superadminOnly } = require('../middlewares/adminAuth');

// Get dashboard stats (accessible to both admin and superadmin)
router.get('/', adminOnly, getDashboard);

// Refresh dashboard stats (superadmin only)
router.post('/refresh', adminOnly, refreshDashboard);

module.exports = router;