const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const {
  getContactSubmissions,
  getContactSubmission,
  createContactSubmission,
  deleteContactSubmission,
  respondToContactSubmission
} = require("../controllers/contactController");
const { adminOnly } = require("../middlewares/adminAuth");

// Validation middleware
const contactValidation = [
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
  body("subject").trim().notEmpty().withMessage("Subject is required"),
  body("details").trim().notEmpty().withMessage("Details are required"),
];

const idValidation = [
  param("id").isMongoId().withMessage("Invalid contact submission ID"),
];

// Routes
router.get("/", adminOnly, getContactSubmissions);
router.get("/:id", adminOnly, idValidation, getContactSubmission);
router.post("/", contactValidation, createContactSubmission);
router.delete("/:id", adminOnly, idValidation, deleteContactSubmission);
// routes/contactRoutes.js (or wherever you're defining routes)

router.post(
  "/:id/respond",
  adminOnly,
  idValidation,
  body("message").trim().notEmpty().withMessage("Response message is required"),
  respondToContactSubmission
);

module.exports = router;
