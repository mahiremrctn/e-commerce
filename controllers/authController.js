const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { accessToken, refreshToken } = require('../config/jwtConfig');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

const generateTokens = (user) => {
  const userId = user._id ? user._id.toString() : user.id;
  const userRole = user.role || 'user';

  const accessTokenPayload = { id: userId, email: user.email, role: userRole };
  const refreshTokenPayload = { id: userId };

  const newAccessToken = jwt.sign(accessTokenPayload, accessToken.secret, {
    expiresIn: accessToken.expiresIn,
  });

  const newRefreshToken = jwt.sign(refreshTokenPayload, refreshToken.secret, {
    expiresIn: refreshToken.expiresIn,
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

const registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Bu email adresi zaten kayıtlı!' });
    }

    // Password hash'leme
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const adminCount = await User.countDocuments({ role: 'admin' });
    const userRole = role === 'admin' && adminCount === 0 ? 'admin' : 'user';

    const createdUser = await User.create({
      email,
      password: hashedPassword,
      role: userRole,
    });

    const userWithoutPassword = {
      id: createdUser._id.toString(),
      email: createdUser.email,
      role: createdUser.role,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    };

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    // Şifre Kontrolü
    const validPassword = await bcryptjs.compare(
      password,
      existingUser.password,
    );

    if (!validPassword) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    const userWithoutPassword = {
      id: existingUser._id.toString(),
      email: existingUser.email,
      role: existingUser.role,
      createdAt: existingUser.createdAt,
      updatedAt: existingUser.updatedAt,
    };

    const tokens = generateTokens(existingUser);

    await RefreshToken.deleteMany({ userId: existingUser._id });

    await RefreshToken.create({
      userId: existingUser._id, 
      token: tokens.refreshToken,
    });

    res
      .status(200)
      .json({ message: 'Giriş başarılı!', user: userWithoutPassword, tokens });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const refreshTokens = async (req, res) => {
  try {
    const oldRefreshToken = req.body.refreshToken;

    if (!oldRefreshToken) {
      return res
        .status(400)
        .json({ message: 'Refresh token değeri zorunludur!' });
    }

    await RefreshToken.deleteMany({ token: oldRefreshToken });

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: 'Geçersiz kullanıcı bilgisi. Lütfen tekrar giriş yapın.',
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ message: 'Kullanıcı bulunamadı. Lütfen tekrar giriş yapın.' });
    }

    const tokens = generateTokens(user);

    await RefreshToken.create({
      userId: user._id,
      token: tokens.refreshToken,
    });

    res.status(200).json(tokens);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res
        .status(400)
        .json({ message: 'Refresh token değeri zorunludur!' });
    }

    await RefreshToken.deleteOne({ token });

    return res.status(200).json({ message: 'Çıkış başarılı!' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
};
