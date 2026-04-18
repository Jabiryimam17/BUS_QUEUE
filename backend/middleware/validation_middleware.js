const { validationResult } = require('express-validator');
const { send_error } = require('../utils/response');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return send_error(res, 'Validation failed', 400, errors.array());
  }
  next();
};

module.exports = validate;
