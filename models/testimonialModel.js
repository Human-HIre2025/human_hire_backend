const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    review: {
        type: String,
        required: true,
        trim: true
    },
    authorImg: {
        type: String,
        required: false
    },
    authorName: {
        type: String,
        required: true,
        trim: true
    },
    authorPosition: {
        type: String,
        required: true,
        trim: true
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
testimonialSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Testimonial', testimonialSchema);