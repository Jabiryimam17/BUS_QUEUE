const express = require('express');
const { body } = require('express-validator');
const TicketController = require('../controllers/ticket_controller');
const { authenticate, authorize_student, authorize_admin } = require('../middleware/auth_middleware');
const validate = require('../middleware/validation_middleware');

const router = express.Router();

// Book ticket (student only)
router.post(
  '/book',
  authenticate,
  authorize_student,
  [
    body('bus_id').notEmpty().withMessage('Bus ID is required')
  ],
  validate,
  TicketController.book_ticket
);

// Get my ticket (student only)
router.get('/my-ticket', authenticate, authorize_student, TicketController.get_my_ticket);

// Get bus queue (admin/controller only)
router.get('/queue/:bus_id', authenticate, authorize_admin, TicketController.get_bus_queue);

// Penalize ticket (admin only)
router.post(
  '/:ticket_id/penalize',
  authenticate,
  authorize_admin,
  [
    body('current_queue_position').isInt({ min: 1 }).withMessage('Valid current queue position is required')
  ],
  validate,
  TicketController.penalize_ticket
);

// Mark late arrival (admin only)
router.post('/:ticket_id/mark-late', authenticate, authorize_admin, TicketController.mark_late_arrival);

// Rearrange queue (admin only)
router.post('/queue/:bus_id/rearrange', authenticate, authorize_admin, TicketController.rearrange_queue);

// Cancel ticket (student only)
router.delete('/:ticket_id', authenticate, authorize_student, TicketController.cancel_ticket);

module.exports = router;
