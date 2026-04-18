const TicketService = require('../services/ticket_service');
const { send_success, send_error } = require('../utils/response');

class TicketController {
  static async book_ticket(req, res) {
    try {
      const user_id = req.user.user_id;
      const { bus_id } = req.body;

      if (!bus_id) {
        return send_error(res, 'Bus ID is required', 400);
      }

      const result = await TicketService.book_ticket(user_id, bus_id);
      return send_success(res, result, result.message, 201);
    } catch (error) {
      return send_error(res, error.message, 400);
    }
  }

  static async get_my_ticket(req, res) {
    try {
      const user_id = req.user.user_id;
      const ticket = await TicketService.get_user_ticket(user_id);
      
      if (!ticket) {
        return send_success(res, null, 'No active ticket found');
      }

      return send_success(res, ticket);
    } catch (error) {
      return send_error(res, error.message, 500);
    }
  }

  static async get_bus_queue(req, res) {
    try {
      const { bus_id } = req.params;
      const queue = await TicketService.get_bus_queue(bus_id);
      return send_success(res, queue);
    } catch (error) {
      return send_error(res, error.message, 404);
    }
  }

  static async cancel_ticket(req, res) {
    try {
      const user_id = req.user.user_id;
      const { ticket_id } = req.params;
      const result = await TicketService.cancel_ticket(ticket_id, user_id);
      return send_success(res, result, result.message);
    } catch (error) {
      return send_error(res, error.message, 400);
    }
  }

  static async penalize_ticket(req, res) {
    try {
      const { ticket_id } = req.params;
      const { current_queue_position } = req.body;

      if (!current_queue_position || current_queue_position < 1) {
        return send_error(res, 'Valid current queue position is required', 400);
      }

      const result = await TicketService.penalize_user(ticket_id, current_queue_position);
      return send_success(res, result, result.message);
    } catch (error) {
      return send_error(res, error.message, 400);
    }
  }

  static async mark_late_arrival(req, res) {
    try {
      const { ticket_id } = req.params;
      const result = await TicketService.mark_late_arrival(ticket_id);
      return send_success(res, result, result.message);
    } catch (error) {
      return send_error(res, error.message, 400);
    }
  }

  static async rearrange_queue(req, res) {
    try {
      const { bus_id } = req.params;
      const result = await TicketService.rearrange_queue(bus_id);
      return send_success(res, result, result.message);
    } catch (error) {
      return send_error(res, error.message, 400);
    }
  }
}

module.exports = TicketController;
