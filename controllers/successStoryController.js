const SuccessStory = require("../models/successStoryModel");

// Get all success story types
exports.getAllSuccessStory = async (req, res) => {
  try {
    const successStoryTypes = await SuccessStory.find();
    res.status(200).json({
      success: true,
      data: successStoryTypes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


// Get success stories by type
exports.getSuccessStoriesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const successStoryType = await SuccessStory.findOne({ type });
    if (!successStoryType) {
      return res.status(404).json({
        success: false,
        message: `No success stories found for type: ${type}`,
      });
    }
    res.status(200).json({
      success: true,
      data: successStoryType,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Create a single story in a success story type
exports.createStory = async (req, res) => {
    try {
      const { type } = req.params;
      const { testimonial, clientInfo } = req.body;
  
      let successStoryType = await SuccessStory.findOne({ type });
      
      // Create new type if doesn't exist
      if (!successStoryType) {
        successStoryType = await SuccessStory.create({ 
          type,
          stories: []
        });
      }
  
      successStoryType.stories.push({ testimonial, clientInfo });
      await successStoryType.save();
  
      res.status(201).json({
        success: true,
        data: successStoryType,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Validation Error",
        error: error.message,
      });
    }
  };

// Update a single story in a success story type
exports.updateStory = async (req, res) => {
  try {
    const { type, storyId } = req.params;
    const { testimonial, clientInfo } = req.body;

    const successStoryType = await SuccessStory.findOne({ type });
    if (!successStoryType) {
      return res.status(404).json({
        success: false,
        message: `Success story type '${type}' not found`,
      });
    }

    const story = successStoryType.stories.id(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    if (testimonial) {
      story.testimonial.review = testimonial.review || story.testimonial.review;
      story.testimonial.author = testimonial.author || story.testimonial.author;
    }
    if (clientInfo) {
      story.clientInfo.client = clientInfo.client || story.clientInfo.client;
      story.clientInfo.industry =
        clientInfo.industry || story.clientInfo.industry;
      story.clientInfo.region = clientInfo.region || story.clientInfo.region;
    }

    await successStoryType.save();
    res.status(200).json({
      success: true,
      data: successStoryType,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation Error",
      error: error.message,
    });
  }
};

// Delete a single story in a success story type
exports.deleteStory = async (req, res) => {
  try {
    const { type, storyId } = req.params;

    const successStoryType = await SuccessStory.findOne({ type });
    if (!successStoryType) {
      return res.status(404).json({
        success: false,
        message: `Success story type '${type}' not found`,
      });
    }

    const story = successStoryType.stories.id(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    successStoryType.stories.pull(storyId);
    await successStoryType.save();

    res.status(200).json({
      success: true,
      message: "Story deleted successfully",
      data: successStoryType,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
