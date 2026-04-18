const UserService = require('../services/user_service');
const { send_success, send_error } = require('../utils/response');

class UserController {
  static async get_pending_registrations(req, res) {
    try {
      const registrations = await UserService.get_pending_registrations();
      return send_success(res, registrations);
    } catch (error) {
      return send_error(res, error.message, 500);
    }
  }

  static async approve_registration(req, res) {
    try {
      const { registration_id } = req.params;
      const result = await UserService.approve_registration(registration_id);
      return send_success(res, result, result.message);
    } catch (error) {
      return send_error(res, error.message, 400);
    }
  }

  static async reject_registration(req, res) {
    try {
      const { registration_id } = req.params;
      const result = await UserService.reject_registration(registration_id);
      return send_success(res, result, result.message);
    } catch (error) {
      return send_error(res, error.message, 400);
    }
  }

  static async get_user_by_id(req, res) {
    try {
      const { user_id } = req.params;
      const user = await UserService.get_user_by_id(user_id);
      return send_success(res, user);
    } catch (error) {
      return send_error(res, error.message, 404);
    }
  }

  static async get_my_profile(req, res) {
    try {
      const user_id = req.user.user_id;
      const user = await UserService.get_my_profile(user_id);
      return send_success(res, user);
    } catch (error) {
      return send_error(res, error.message, 404);
    }
  }

  static async update_my_profile(req, res) {
    try {
      const user_id = req.user.user_id;
      const result = await UserService.update_profile(user_id, req.body);
      return send_success(res, result, result.message);
    } catch (error) {
      return send_error(res, error.message, 400);
    }
  }
}

module.exports = UserController;
