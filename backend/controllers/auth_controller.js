const AuthService = require('../services/auth_service');
const { send_success, send_error } = require('../utils/response');

class AuthController {
  static async register(req, res) {
    try {
      const result = await AuthService.register_user(req.body);
      return send_success(res, result, result.message, 201);
    } catch (error) {
      return send_error(res, error.message, 400);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return send_error(res, 'Email and password are required', 400);
      }

      const result = await AuthService.login_user(email, password);
      return send_success(res, result, 'Login successful');
    } catch (error) {
      return send_error(res, error.message, 401);
    }
  }

  static async get_status(req, res) {
    try {
      const user_id = req.user.user_id;
      const result = await AuthService.get_user_status(user_id);
      return send_success(res, result);
    } catch (error) {
      return send_error(res, error.message, 404);
    }
  }

  static async forgot_password(req, res) {
    try {
      const { email } = req.body;
      const result = await AuthService.request_password_reset(email);
      return send_success(res, result, result.message);
    } catch (error) {
      return send_error(res, error.message, 400);
    }
  }

  static async reset_password(req, res) {
    try {
      const { email, code, new_password } = req.body;
      const result = await AuthService.reset_password(email, code, new_password);
      return send_success(res, result, result.message);
    } catch (error) {
      return send_error(res, error.message, 400);
    }
  }
}

module.exports = AuthController;
