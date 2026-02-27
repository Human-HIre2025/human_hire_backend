const mongoose = require('mongoose');

const DashboardSchema = new mongoose.Schema({
  stats: {
    totalBusinessInquiries: { type: Number, default: 0 },
    totalAppointments: { type: Number, default: 0 },
    totalJobApplications: { type: Number, default: 0 },
    totalOpenJobs: { type: Number, default: 0 },
    totalAdmins: { type: Number, default: 0 },
    totalTeamMembers: { type: Number, default: 0 },
    totalFeaturedTeamMembers: { type: Number, default: 0 },
    totalContactMessages: { type: Number, default: 0 },
    totalPendingContactMessages: { type: Number, default: 0 },
    totalClients: { type: Number, default: 0 }
  },
  lastRefreshed: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Dashboard', DashboardSchema);