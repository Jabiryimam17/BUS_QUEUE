const BusService = require('../services/bus_service');
const { send_success, send_error } = require('../utils/response');

class BusController {
  static async create_bus(req, res) {
    try {
      const result = await BusService.create_bus(req.body);
      return send_success(res, result, result.message, 201);
    } catch (error) {
      return send_error(res, error.message, 400);
    }
  }

  static async get_upcoming_buses(req, res) {
    try {
      // Get user_id if authenticated (optional for this endpoint)
      const user_id = req.user ? req.user.user_id : null;
      const buses = await BusService.get_upcoming_buses(user_id);
      return send_success(res, buses);
    } catch (error) {
      return send_error(res, error.message, 500);
    }
  }

  static async get_all_buses(req, res) {
    try {
      const buses = await BusService.get_all_buses();
      return send_success(res, buses);
    } catch (error) {
      return send_error(res, error.message, 500);
    }
  }

  static async get_bus_by_id(req, res) {
    try {
      const { bus_id } = req.params;
      const bus = await BusService.get_bus_by_id(bus_id);
      return send_success(res, bus);
    } catch (error) {
      return send_error(res, error.message, 404);
    }
  }

  static async update_bus(req, res) {
    try {
      const { bus_id } = req.params;
      const result = await BusService.update_bus(bus_id, req.body);
      return send_success(res, result, result.message);
    } catch (error) {
      return send_error(res, error.message, 400);
    }
  }

  static async delete_bus(req, res) {
    try {
      const { bus_id } = req.params;
      const result = await BusService.delete_bus(bus_id);
      return send_success(res, result, result.message);
    } catch (error) {
      return send_error(res, error.message, 400);
    }
  }
}

module.exports = BusController;
