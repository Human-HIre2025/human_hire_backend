// routes/terms.js
const express = require('express');
const router = express.Router();
const { getTerms, updateTerms } = require('../controllers/termsPageController');
const { adminOnly } = require('../middlewares/adminAuth');
const upload = require('../middlewares/multer');

router.route('/')
  .get(getTerms)          // GET /api/terms - Public access
  .put(upload.none(), adminOnly, updateTerms); // PUT /api/terms - Admin only

module.exports = router;