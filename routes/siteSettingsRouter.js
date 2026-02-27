// src/routes/siteSettings.routes.js
const express = require('express');
const router = express.Router();
const { getSiteSettings, saveSiteSettings, uploadSitemap, getSitemap } = require('../controllers/siteSettingsController');

router.get('/', getSiteSettings);
router.post('/', saveSiteSettings);
router.post("/upload-sitemap",uploadSitemap)
router.get('/get-sitemap', getSitemap); 
module.exports = router;
