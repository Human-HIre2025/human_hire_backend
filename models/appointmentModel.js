const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  service: { type: String, required: true }, // e.g., Consultation, Demo, etc.
  date: { type: String, required: true },    // Format: YYYY-MM-DD
  timeSlot: { type: String, required: true }, // e.g., "10:00 AM - 11:00 AM"
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
