const mongoose = require("mongoose");
const axios = require("axios");
const { storeOnCloudinary } = require("../utils/imageUtils");

const Carousel = require("../models/carouselModel");
const Client = require("../models/clientModel");
const TeamMember = require("../models/teamMemberModel");
const Favicons = require("../models/feviconModel");
const Testimonial = require("../models/testimonialModel");
const connectDB = require("../db/db"); // your actual DB connection logic

// 🔧 Helper: fetch image and return file-like object for Cloudinary
const fetchImageAsFile = async (url) => {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  const buffer = Buffer.from(res.data, "binary");
  const mimetype = res.headers["content-type"];
  return { buffer, mimetype, size: buffer.length };
};

// 🚀 Migration functions for each model

const migrateCarousel = async () => {
  const docs = await Carousel.find();
  for (const doc of docs) {
    let updated = false;
    for (const img of doc.images) {
      if (img.imageUrl?.includes("res.cloudinary.com")) {
        const file = await fetchImageAsFile(img.imageUrl);
        const newUrl = await storeOnCloudinary(file);
        img.imageUrl = newUrl;
        updated = true;
      }
    }
    if (updated) await doc.save();
  }
  console.log("✅ Carousel updated");
};

const migrateClients = async () => {
  const docs = await Client.find();
  for (const doc of docs) {
    if (doc.logo?.includes("res.cloudinary.com")) {
      const file = await fetchImageAsFile(doc.logo);
      const newUrl = await storeOnCloudinary(file);
      doc.logo = newUrl;
      await doc.save();
    }
  }
  console.log("✅ Clients updated");
};

const migrateTeamMembers = async () => {
  const docs = await TeamMember.find();
  for (const doc of docs) {
    if (doc.image?.includes("res.cloudinary.com")) {
      const file = await fetchImageAsFile(doc.image);
      const newUrl = await storeOnCloudinary(file);
      doc.image = newUrl;
      await doc.save();
    }
  }
  console.log("✅ Team Members updated");
};

const migrateFavicons = async () => {
  const docs = await Favicons.find();
  for (const doc of docs) {
    let updated = false;
    for (const key of ["headerLogo", "footerLogo", "feviconLogo"]) {
      if (doc[key]?.includes("res.cloudinary.com")) {
        const file = await fetchImageAsFile(doc[key]);
        const newUrl = await storeOnCloudinary(file);
        doc[key] = newUrl;
        updated = true;
      }
    }
    if (updated) await doc.save();
  }
  console.log("✅ Favicons updated");
};

const migrateTestimonials = async () => {
  const docs = await Testimonial.find();
  for (const doc of docs) {
    if (doc.authorImg?.includes("res.cloudinary.com")) {
      const file = await fetchImageAsFile(doc.authorImg);
      const newUrl = await storeOnCloudinary(file);
      doc.authorImg = newUrl;
      await doc.save();
    }
  }
  console.log("✅ Testimonials updated");
};

// 🧠 Main function to run all
(async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected Successfully\n");

    await migrateCarousel();
    await migrateClients();
    await migrateTeamMembers();
    await migrateFavicons();
    await migrateTestimonials();

    console.log("\n🎉 All images migrated to new Cloudinary account!");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    mongoose.disconnect();
  }
})();
