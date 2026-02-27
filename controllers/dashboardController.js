const Dashboard = require('../models/dashboardModel');
const BusinessDetails = require('../models/businessDetails');
const Appointment = require('../models/appointmentModel');
const JobApplication = require('../models/jobApplication');
const Job = require('../models/jobModel');
const Admin = require('../models/adminModel');
const TeamMember = require('../models/teamMemberModel');
const ContactUs = require('../models/contactModel');
const Client = require('../models/clientModel');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private (Admin/Superadmin)
exports.getDashboard = async (req, res) => {
  try {
    const dashboard = await Dashboard.findOne().sort({ lastRefreshed: -1 });

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: 'Dashboard stats not found'
      });
    }

    res.status(200).json({
      success: true,
      data: dashboard.stats,
      lastRefreshed: dashboard.lastRefreshed
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

// @desc    Refresh dashboard statistics
// @route   POST /api/dashboard/refresh
// @access  Private (Superadmin only)
exports.refreshDashboard = async (req, res) => {
  try {
    // Calculate all stats
    const stats = {
      totalBusinessInquiries: await BusinessDetails.countDocuments(),
      totalAppointments: await Appointment.countDocuments(),
      totalJobApplications: await JobApplication.countDocuments(),
      totalOpenJobs: await Job.countDocuments(),
      totalAdmins: await Admin.countDocuments(),
      totalTeamMembers: await TeamMember.countDocuments(),
      totalFeaturedTeamMembers: await TeamMember.countDocuments({ isFeatured: true }),
      totalContactMessages: await ContactUs.countDocuments(),
      totalPendingContactMessages: await ContactUs.countDocuments({ 'response.message': { $exists: false } }),
      totalClients: await Client.countDocuments()
    };

    // Update or create dashboard document
    const dashboard = await Dashboard.findOneAndUpdate(
      {}, // Update the first document (we only need one)
      {
        stats,
        lastRefreshed: new Date()
      },
      {
        upsert: true, // Create if not exists
        new: true, // Return updated document
        setDefaultsOnInsert: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Dashboard stats refreshed successfully',
      data: dashboard.stats,
      lastRefreshed: dashboard.lastRefreshed
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};