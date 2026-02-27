const Admin = require("../models/adminModel");

// @desc    Register admin
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password,
    });

    sendTokenResponse(admin, 201, res);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check for admin
    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if password matches
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    sendTokenResponse(admin, 200, res);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// @desc    Logout admin
// @route   GET /api/auth/logout
// @access  Private
exports.logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,           // Required if sameSite is 'None'
    sameSite: "None",       // Required for cross-site cookies
    expires: new Date(0),   // Expire it immediately
  });

  res.status(200).json({
    success: true,
    message: "Successfully logged out",
  });
};
// @desc    Get current logged in admin
// @route   GET /api/auth/me
// @access  Private
exports.getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// @desc    Create new admin (superadmin only)
// @route   POST /api/auth/create-admin
// @access  Private/Superadmin
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Create admin with role 'admin'
    const admin = await Admin.create({
      name,
      email,
      password,
      role: "admin",
    });

    res.status(201).json({
      success: true,
      data: {
        _id: admin._id,
        ชื่อ: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// @desc    Delete admin (superadmin only)
// @route   DELETE /api/auth/delete-admin/:id
// @access  Private/Superadmin
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Prevent superadmin from deleting themselves
    if (admin._id.toString() === req.admin.id) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete own superadmin account",
      });
    }

    await Admin.deleteOne({ _id: admin._id });

    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// @desc    Get all admins (superadmin only)
// @route   GET /api/auth/admins
// @access  Private/Superadmin
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password"); // Exclude passwords

    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// Helper function to send token response
const sendTokenResponse = (admin, statusCode, res) => {
  const token = admin.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
    httpOnly: true,
    secure: true, // MUST be true in production (HTTPS)
    sameSite: "None", // 'None' is required for cross-site cookies
  };

  const adminResponse = { ...admin._doc };
  delete adminResponse.password;

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    data: adminResponse,
  });
};
