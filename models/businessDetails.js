const mongoose = require('mongoose');

const BusinessDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  service: { type: String, required: true }, // e.g., Web Dev, SEO, Marketing
  projectDetails: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('BusinessDetails', BusinessDetailsSchema);
