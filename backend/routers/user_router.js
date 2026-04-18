const express = require('express');
const UserController = require('../controllers/user_controller');
const { authenticate, authorize_admin } = require('../middleware/auth_middleware');
const upload = require('../configs/cloudinary');

const router = express.Router();

// Get pending registrations (admin only)
router.get('/pending', authenticate, authorize_admin, UserController.get_pending_registrations);

// Approve registration (admin only)
router.post('/:registration_id/approve', authenticate, authorize_admin, UserController.approve_registration);

// Reject registration (admin only)
router.post('/:registration_id/reject', authenticate, authorize_admin, UserController.reject_registration);

// Get user by ID (admin only)
router.get('/:user_id', authenticate, authorize_admin, UserController.get_user_by_id);

// Get my profile (authenticated users)
router.get('/me/profile', authenticate, UserController.get_my_profile);

// Update my profile (authenticated users - only for rejected/pending)
router.put(
  '/me/profile',
  authenticate,
  upload.fields([
    { name: 'face_photo', maxCount: 1 },
    { name: 'id_photo', maxCount: 1 }
  ]),
  (req, res) => {
    if (req.files) {
      if (req.files.face_photo?.[0]) {
        req.body.face_photo_path = req.files.face_photo[0].path;
      }
      if (req.files.id_photo?.[0]) {
        req.body.id_photo_path = req.files.id_photo[0].path;
      }
    }
    UserController.update_my_profile(req, res);
  }
);

module.exports = router;
