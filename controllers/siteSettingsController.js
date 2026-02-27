const SiteSettings = require('../models/siteSettingsModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'upload');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    if (file.originalname !== 'sitemap.xml') {
      return cb(new Error('File must be named sitemap.xml'));
    }
    cb(null, 'sitemap.xml');
  },
});

// File filter to allow only XML files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/xml' && file.originalname === 'sitemap.xml') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file. Must be sitemap.xml (XML format).'), false);
  }
};

// Multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1_000_000 }, // 1MB limit
});

const getSiteSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.find();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const saveSiteSettings = async (req, res) => {
  try {
    const { category, data } = req.body;
    const setting = await SiteSettings.findOneAndUpdate(
      { category },
      { category, data },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: setting });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const uploadSitemap = async (req, res) => {
  try {
    upload.single('sitemap')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded.' });
      }

      res.json({
        success: true,
        message: 'File uploaded successfully.',
        file: '/upload/sitemap.xml',
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// New function: Get sitemap
const getSitemap = async (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', 'upload', 'sitemap.xml');
    await fs.access(filePath); // Check if file exists
    res.sendFile(filePath, {
      headers: { 'Content-Type': 'text/xml' },
    });
  } catch (error) {
    res.status(404).json({ success: false, error: 'Sitemap file not found' });
  }
};

module.exports = {
  getSiteSettings,
  saveSiteSettings,
  uploadSitemap,
  getSitemap,
};