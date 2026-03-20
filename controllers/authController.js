const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Token oluşturmak için yardımcı fonksiyon
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const newUser = await User.create({ email, password });

    const token = createToken(newUser._id);
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error('Kayıt Hatası Detayı:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Kullanıcı Bulunamadı" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Invalid credentials / Geçersiz bilgiler" });

    const token = createToken(user._id);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
