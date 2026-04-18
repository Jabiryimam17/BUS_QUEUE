const express = require('express');
const { body } = require('express-validator');
const BusController = require('../controllers/bus_controller');
const { authenticate, authenticate_optional, authorize_admin } = require('../middleware/auth_middleware');
const validate = require('../middleware/validation_middleware');

const router = express.Router();

// Get upcoming buses (public, but checks auth if provided)
router.get('/upcoming', authenticate_optional, BusController.get_upcoming_buses);

// Get all buses (admin only)
router.get('/', authenticate, authorize_admin, BusController.get_all_buses);

// Get bus by ID
router.get('/:bus_id', BusController.get_bus_by_id);

// Create bus (admin only)
router.post(
  '/',
  authenticate,
  authorize_admin,
  [
    body('route').notEmpty().withMessage('Route is required'),
    body('scheduled_time').isISO8601().withMessage('Valid scheduled time is required'),
    body('ticket_window_open').isISO8601().withMessage('Valid window open time is required'),
    body('ticket_window_close').isISO8601().withMessage('Valid window close time is required'),
    body('total_tickets').isInt({ min: 1 }).withMessage('Total tickets must be a positive integer')
  ],
  validate,
  BusController.create_bus
);

// Update bus (admin only)
router.put('/:bus_id', authenticate, authorize_admin, BusController.update_bus);

// Delete bus (admin only)
router.delete('/:bus_id', authenticate, authorize_admin, BusController.delete_bus);

module.exports = router;
