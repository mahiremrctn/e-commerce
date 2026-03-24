const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

// 1. Check if token exists in Headers / Header'da token var mı?
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from "Bearer TOKEN_STRING"
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify token / Token'ı doğrula
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get user from token and attach to Request / Kullanıcıyı isteğe ekle
      req.user = await User.findById(decoded.id).select('-password');

      next(); //Access granted ! Giriş serbest
    } catch (error) {
      res.status(401).json({ message: ' Not authorized, token failed / Yetkisiz erişim'});
    }
  }
  
  if (!token) {
    res.status(401).json({ message: 'No token authorization denied/ Token bulunamadı'});
  }
};