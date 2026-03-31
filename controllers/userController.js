const bcryptjs = require('bcryptjs');
const User = require('../models/User');

const sanitizeUser = (userDoc) => {
  const user = userDoc.toObject ? userDoc.toObject() : userDoc;
  const { password, ...safeUser } = user;
  return safeUser;
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

const createNewUser = async (req, res) => {
  try{
    const { email, password, role } = req.body;

    if(!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'email ve password zorunludur',
      });
    }

    const existingUser = await User.findOne({ email }).select(('_id')).lean();

    if (existingUser)
      return res.status(400).json({
        success: false,
        message: 'Bu email adresi zaten kayitli',
    });
  

  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  const createdUser = await User.create({
    email,
    password: hashedPassword,
    role,
  });

  res.status(201).json({ success: true, data: sanitizeUser(createdUser) });
} catch (error) {
  res.status(400).json({ success: false, message: error.message });
  }
};


