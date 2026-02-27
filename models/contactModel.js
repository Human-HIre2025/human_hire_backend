const mongoose = require('mongoose');

const ContactUsSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true },
  phone:     { type: String, required: true },
  subject:   { type: String, required: true },
  details:   { type: String, required: true },
  response: {
    message:     { type: String },
    respondedAt: { type: Date },
    respondedBy: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('ContactUs', ContactUsSchema);
