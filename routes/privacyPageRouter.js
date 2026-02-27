// routes/privacy.js
const express = require('express');
const router = express.Router();
const { getPrivacy, updatePrivacy } = require('../controllers/privacyPageController');
const { adminOnly } = require('../middlewares/adminAuth');
const upload = require('../middlewares/multer');

router.route('/')
    .get(getPrivacy)          // GET /api/privacy - Public access
    .put(upload.none(), adminOnly, updatePrivacy); // PUT /api/privacy - Admin only

module.exports = router;