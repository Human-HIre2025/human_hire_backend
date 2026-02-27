const Favicons = require('../models/feviconModel');
const { storeOnCloudinary, validateImage } = require('../utils/imageUtils');

const getFavicons = async (req, res) => {
  try {
    const favicons = await Favicons.findOne();
    res.json({ success: true, data: favicons || {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const saveFavicons = async (req, res) => {
  try {
    const files = req.files;
    const faviconData = {};

    const timestamp = Date.now();

    for (const [key, file] of Object.entries(files)) {
      validateImage(file[0]);

      const uploadResponse = await storeOnCloudinary(file[0]);
      console.log(`[DEBUG] storeOnCloudinary response for key "${key}":`, uploadResponse);

      // Extract URL from response:
      let url;
      if (typeof uploadResponse === 'string') {
        url = uploadResponse;
      } else if (uploadResponse && uploadResponse.url) {
        url = uploadResponse.url;
      } else {
        throw new Error(`Unexpected storeOnCloudinary response format for key "${key}"`);
      }

      console.log(`[DEBUG] URL before appending version: ${url}`);

      url += url.includes('?') ? `&v=${timestamp}` : `?v=${timestamp}`;

      console.log(`[DEBUG] URL after appending version: ${url}`);

      faviconData[key] = url;
    }

    const favicons = await Favicons.findOneAndUpdate(
      {},
      { $set: faviconData },
      { upsert: true, new: true }
    );

    console.log('[DEBUG] Updated favicon document saved:', favicons);

    res.json({ success: true, favicon: favicons });
  } catch (error) {
    console.log('[ERROR] saveFavicons error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getFavicons,
  saveFavicons,
};
