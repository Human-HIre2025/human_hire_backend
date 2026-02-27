const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');

// Protect routes (for both admin and superadmin)
exports.adminOnly = async (req, res, next) => {
  let token;
console.log('req.cookies', req.cookies)
  // Check for token in Authorization header or cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
console.log('token', token)
  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if admin exists
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'No admin found with this id'
      });
    }

    // Attach admin to request object
    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Authorize superadmin only
exports.superadminOnly = async (req, res, next) => {
  if (req.admin && req.admin.role === 'superadmin') {
    next();
  } else {
    return res.status(403).json({
      success: false, 
      message: 'Not authorized as superadmin'
    });
  }
};