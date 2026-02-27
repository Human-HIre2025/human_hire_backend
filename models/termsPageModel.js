// models/Terms.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TermsSchema = new Schema({
  heading: {
    type: String,
    required: [true, 'Heading is required'],
    trim: true,
    default: 'Terms & Conditions'
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    default: '<p>No terms available yet.</p>' // Default HTML content
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Terms', TermsSchema);