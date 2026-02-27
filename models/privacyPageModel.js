// models/Privacy.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PrivacySchema = new Schema({
  heading: {
    type: String,
    required: [true, 'Heading is required'],
    trim: true,
    default: 'Privacy Policy'
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    default: '<p>No privacy policy available yet.</p>' // Default HTML content
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Privacy', PrivacySchema);