const { send_error } = require('../utils/response');

const error_handler = (err, req, res, next) => {
  console.error('Error:', err);

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return send_error(res, 'File size too large. Maximum size is 5MB', 400);
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return send_error(res, 'Unexpected file field', 400);
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return send_error(res, err.message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return send_error(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return send_error(res, 'Token expired', 401);
  }

  // Default error
  return send_error(res, err.message || 'Internal server error', err.status || 500);
};

const not_found_handler = (req, res) => {
  return send_error(res, 'Route not found', 404);
};

module.exports = {
  error_handler,
  not_found_handler
};
