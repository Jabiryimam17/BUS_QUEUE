const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/auth_controller');
const { authenticate } = require('../middleware/auth_middleware');
const validate = require('../middleware/validation_middleware');
const { send_error } = require('../utils/response');
const upload = require('../configs/cloudinary');

const router = express.Router();
const multi_upload = upload.fields([
  { name: 'face_photo', maxCount: 1 },
  { name: 'id_photo', maxCount: 1 }
]);
// Register route with file upload
router.post(
  '/register',
  multi_upload,
  [
    body('university_id').notEmpty().withMessage('University ID is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('department').notEmpty().withMessage('Department is required')
  ],
  validate,
  (req, res) => {
    const face = req.files?.face_photo?.[0];
    const id_card = req.files?.id_photo?.[0];
    if (!face || !id_card) {
      return send_error(res, 'Face photo and ID photo are required', 400);
    }
    // multer-storage-cloudinary sets path to secure_url
    req.body.face_photo_path = face.path;
    req.body.id_photo_path = id_card.path;
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
