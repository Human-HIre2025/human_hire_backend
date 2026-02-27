const mongoose = require('mongoose');

const CarouselImageSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['team', 'event'],
    required: true
  },
  text: {
    type: String,
    required: false // Optional image caption or description
  },
  imageUrl: {
    type: String,
    required: true
  }
});

const CarouselSchema = new mongoose.Schema({
  images: [CarouselImageSchema]
});

module.exports = mongoose.model('Carousel', CarouselSchema);
