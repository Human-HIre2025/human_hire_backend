// controllers/termsController.js
const Terms = require('../models/termsPageModel');

// Get Terms & Conditions
exports.getTerms = async (req, res) => {
  try {
    const terms = await Terms.findOne(); // Assuming only one document for Terms
    if (!terms) {
      // If no document exists, create a default one
      const defaultTerms = new Terms();
      await defaultTerms.save();
      return res.status(200).json({
        success: true,
        data: defaultTerms
      });
    }
    res.status(200).json({
      success: true,
      data: terms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Update Terms & Conditions
exports.updateTerms = async (req, res) => {
  try {
    const { heading, content } = req.body;
    let terms = await Terms.findOne();

    if (!terms) {
      terms = new Terms({ heading, content });
    } else {
      terms.heading = heading || terms.heading;
      terms.content = content || terms.content;
      terms.lastUpdated = Date.now();
    }

    await terms.save();
    res.status(200).json({
      success: true,
      data: terms
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      error: error.message
    });
  }
};