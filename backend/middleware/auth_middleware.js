const { verify_token } = require('../utils/jwt');
const { send_error } = require('../utils/response');

const authenticate = (req, res, next) => {
  try {
    const auth_header = req.headers.authorization;

    if (!auth_header || !auth_header.startsWith('Bearer ')) {
      return send_error(res, 'Authentication token required', 401);
    }

    const token = auth_header.substring(7);
    const decoded = verify_token(token);

    if (!decoded) {
      return send_error(res, 'Invalid or expired token', 401);
    }

    req.user = decoded;
    next();
  } catch (error) {
    return send_error(res, 'Authentication failed', 401);
  }
};

const authorize_admin = (req, res, next) => {
  if (req.user.user_type !== 'admin') {
    return send_error(res, 'Admin access required', 403);
  }
  next();
};

const authorize_student = (req, res, next) => {
  if (req.user.user_type !== 'student') {
    return send_error(res, 'Student access required', 403);
  }
  next();
};

// Optional authentication - doesn't fail if no token provided
const authenticate_optional = (req, res, next) => {
  try {
    const auth_header = req.headers.authorization;

    if (auth_header && auth_header.startsWith('Bearer ')) {
      const token = auth_header.substring(7);
      const decoded = verify_token(token);
      if (decoded) {
        req.user = decoded;
      }
    }
    // Continue even if no token
    next();
  } catch (error) {
    // Continue even if token is invalid
    next();
  }
};

module.exports = {
  authenticate,
  authenticate_optional,
  authorize_admin,
  authorize_student
};
