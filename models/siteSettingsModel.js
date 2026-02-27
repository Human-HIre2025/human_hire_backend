// src/models/siteSettings.model.js
const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Contact Information', 'Social Links', 'Maintenance Mode', 'Analytical Script']
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);

