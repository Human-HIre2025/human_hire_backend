require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const connectDB = require("./db/db");
const siteSettingsRoutes = require("./routes/siteSettingsRouter");
const faviconsRoutes = require("./routes/faviconsRouter");
const adminRoutes = require("./routes/adminRouter");
const termsRouters = require("./routes/termsPageRouter");
const privacyRouters = require("./routes/privacyPageRouter");
const clientRoutes = require("./routes/clientRouter");
const teamMemberRoutes = require("./routes/teamMemberRouter");
const testimonialRoutes = require("./routes/testimonialRouter");
const successStoryRoutes = require("./routes/successStoryRouter");
const carouselRoutes = require("./routes/carouselRouter");
const jobRoutes = require("./routes/jobRouter");
const jobApplicationRoutes = require("./routes/jobApplicationRouter");
const contactRoutes = require("./routes/contactRouter");
const businessDetailsRoutes = require("./routes/businessDetailsRouter");
const appointmentRoutes = require("./routes/appointmentRouter");
const dashboardRoutes = require("./routes/dashboardRouter");
const cookieParser = require("cookie-parser");
const path = require("path"); // Add this

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:4173",
      "http://localhost:3000",
      "https://admin.humanhirecorp.com",
      "https://www.humanhirecorp.com",
      "https://humanhirecorp.com",
      "https://www.humalifehealthcare.com",
      "https://human-hire-corp-updated.vercel.app",
      "https://rad-health-care.vercel.app",
      "https://rad-health-care.vercel.app",
    ],
    credentials: true,
  }),
);

//chnages
app.use(express.json({ limit: "50mb" }));
app.use(compression());
app.use(express.static("build")); // Serve React build folder
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use("/upload", express.static("upload"));

// API Routes
app.use("/api/site-settings", siteSettingsRoutes);
app.use("/api/favicons", faviconsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/terms", termsRouters);
app.use("/api/privacy", privacyRouters);
app.use("/api/clients", clientRoutes);
app.use("/api/teams", teamMemberRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/success-stories", successStoryRoutes);
app.use("/api/carousel", carouselRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/job-applications", jobApplicationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/business-details", businessDetailsRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Serve React app for all other routes
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
