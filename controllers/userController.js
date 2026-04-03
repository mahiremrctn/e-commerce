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

const updateUser = async (req, res) => {
  try {
    const userId = req.body.id || req.body.userId || req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Guncelleme icin userId zorunludur',
      });
    }

    const { email, password, role } = req.body;
    const updatePayload = {};

    if (email !== undefined) updatePayload.email = email;
    if (role !== undefined) updatePayload.role = role;

    if (password !== undefined) {
      const salt = await bcryptjs.genSalt(10);
      updatePayload.password = await bcryptjs.hash(password, salt);
    }

    if (!Object.keys(updatePayload).length) {
      return res.status(400).json({
        success: false,
        message: 'Guncellenecek en az bir alan gondermelisiniz',
      });
    }

    if (updatePayload.email) {
      const existingUser = await User.findOne({ email: updatePayload.email })
        .select('_id')
        .lean();

      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({
          success: false,
          message: 'Bu email adresi zaten kullanimda',
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatePayload, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Kullanici bulunamadi',
      });
    }

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedUser = await User.findByIdAndDelete(userId);

    if(!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'Kullanici bulunamadi'
      });
    }

      res.status(200).json({ success: true, message: 'Kullanici silindi' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
