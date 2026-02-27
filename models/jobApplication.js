const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    candidateDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      profession: { type: String, required: true },
      experience: { type: String, required: true }, // Can be string like "2 years"
      currentCTC: { type: String, required: true },
      expectedCTC: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobApplication", JobApplicationSchema);
