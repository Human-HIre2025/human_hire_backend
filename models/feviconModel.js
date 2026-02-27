// src/models/favicons.model.js
const mongoose = require('mongoose');

const faviconsSchema = new mongoose.Schema({
  headerLogo: {
    type: String, // Base64 encoded image
    required: false
  },
  footerLogo: {
    type: String, // Base64 encoded image
    required: false
  },
  feviconLogo: {
    type: String, // Base64 encoded image
    required: false
  }
}, { timestamps: true });

// Ensure only one record exists
faviconsSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    if (count > 0) {
      const err = new Error('Only one favicons record can exist');
      next(err);
    }
  }
  next();
});

module.exports = mongoose.model('Favicons', faviconsSchema);