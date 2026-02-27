
// src/routes/favicons.routes.js
const express = require('express');
const router = express.Router();
const { getFavicons, saveFavicons } = require('../controllers/faviconsController');
const uploadFields = require('../middlewares/uploadFields');

router.get('/', getFavicons);
router.post('/', uploadFields, saveFavicons);

module.exports = router;