// controllers/privacyController.js
const Privacy = require('../models/privacyPageModel');

// Get Privacy Policy
exports.getPrivacy = async (req, res) => {
  try {
    const privacy = await Privacy.findOne(); // Assuming only one document for Privacy
    if (!privacy) {
      // If no document exists, create a default one
      const defaultPrivacy = new Privacy();
      await defaultPrivacy.save();
      return res.status(200).json({
        success: true,
        data: defaultPrivacy
      });
    }
    res.status(200).json({
      success: true,
      data: privacy
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Update Privacy Policy
exports.updatePrivacy = async (req, res) => {
  try {
    const { heading, content } = req.body;
    let privacy = await Privacy.findOne();

    if (!privacy) {
      privacy = new Privacy({ heading, content });
    } else {
      privacy.heading = heading || privacy.heading;
      privacy.content = content || privacy.content;
      privacy.lastUpdated = Date.now();
    }

    await privacy.save();
    res.status(200).json({
      success: true,
      data: privacy
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      error: error.message
    });
  }
};