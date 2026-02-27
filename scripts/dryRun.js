const mongoose = require("mongoose");

const Carousel = require("../models/carouselModel");
const Client = require("../models/clientModel");
const TeamMember = require("../models/teamMemberModel");
const Favicons = require("../models/feviconModel");
const Testimonial = require("../models/testimonialModel");
const connectDB = require("../db/db");

const inspectUrls = async () => {
  await connectDB();
  console.log("🔍 DRY RUN STARTED");

  const logIfCloudinary = (field, value, id) => {
    if (typeof value === "string" && value.includes("res.cloudinary.com")) {
      console.log(`🧠 Found Cloudinary URL in ${field} (Doc: ${id}):`);
      console.log(`   → ${value}`);
    }
  };

  const carousels = await Carousel.find();
  carousels.forEach((doc) =>
    doc.images.forEach((img) =>
      logIfCloudinary("Carousel.imageUrl", img.imageUrl, doc._id)
    )
  );

  const clients = await Client.find();
  clients.forEach((doc) => logIfCloudinary("Client.logo", doc.logo, doc._id));

  const teams = await TeamMember.find();
  teams.forEach((doc) =>
    logIfCloudinary("TeamMember.image", doc.image, doc._id)
  );

  const favicons = await Favicons.find();
  favicons.forEach((doc) => {
    ["headerLogo", "footerLogo", "feviconLogo"].forEach((key) => {
      logIfCloudinary(`Favicons.${key}`, doc[key], doc._id);
    });
  });

  const testimonials = await Testimonial.find();
  testimonials.forEach((doc) =>
    logIfCloudinary("Testimonial.authorImg", doc.authorImg, doc._id)
  );

  console.log("✅ DRY RUN COMPLETE");
  mongoose.disconnect();
};

inspectUrls();
