const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  review: { type: String, required: true },
  author: { type: String, required: true }
});

const ClientInfoSchema = new mongoose.Schema({
  client: { type: String, required: true },
  industry: { type: String, required: true },
  region: { type: String, required: true }
});

const StorySchema = new mongoose.Schema({
  testimonial: TestimonialSchema,
  clientInfo: ClientInfoSchema
});

const SuccessStorySchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['recruitment', 'marketing', 'healthcare'] },
  stories: [StorySchema]
});

module.exports = mongoose.model('SuccessStory', SuccessStorySchema);
