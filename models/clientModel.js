const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    logo: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
clientSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Client', clientSchema);