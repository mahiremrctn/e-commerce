const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }
  
  return res.status(422).json({
    success: false,
    message: 'Validation hatasi',
    errors: errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
      location: error.location,
    })),
  });
};

module.exports = validate;