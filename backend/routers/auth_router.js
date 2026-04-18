const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/auth_controller');
const { authenticate } = require('../middleware/auth_middleware');
const validate = require('../middleware/validation_middleware');
const upload = require('../configs/upload');

const router = express.Router();

// Register route with file upload
router.post(
  '/register',
  upload.fields([
    { name: 'face_photo', maxCount: 1 },
    { name: 'id_photo', maxCount: 1 }
  ]),
  [
    body('university_id').notEmpty().withMessage('University ID is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('department').notEmpty().withMessage('Department is required')
  ],
  validate,
  (req, res) => {
    // Add file paths to body (relative to uploads folder)
    if (req.files) {
      req.body.face_photo_path = req.files.face_photo ? req.files.face_photo[0].filename : null;
      req.body.id_photo_path = req.files.id_photo ? req.files.id_photo[0].filename : null;
    }
    AuthController.register(req, res);
  }
);

// Login route
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  AuthController.login
);

// Forgot password (request reset code)
router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('Valid email is required')
  ],
  validate,
  AuthController.forgot_password
);

// Reset password using code
router.post(
  '/reset-password',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('code').isLength({ min: 4 }).withMessage('Valid reset code is required'),
    body('new_password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  validate,
  AuthController.reset_password
);

// Get user status (protected)
router.get('/status', authenticate, AuthController.get_status);

module.exports = router;
