const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if(!req.user) {
      return res.status(401).json({
        message: 'Bu işlemi gerçekleştirmek için önce giriş yapmalisiniz. ',
      });
    }

    const userRole = req.user.role;

    if(!userRole) {
      return res
        .status(403)
        .json({ message: 'Bu işlem için gerekli role bilgisine ulaşilamadi' });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Bu işlem için yetkiniz yok.' });
    }

    next();
  };
};
module.exports = { authorizeRoles };