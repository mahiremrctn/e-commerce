const bcryptjs = require('bcryptjs');
const User = require('../models/User');

const sanitizeUser = (userDoc) => {
  const user = userDoc.toObject ? userDoc.toObject() : userDoc;
  const { password, ...safeUser } = user;
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 })
    .lean();

    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};