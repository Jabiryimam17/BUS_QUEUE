const UserModel = require('../models/user_model');
const { hash_password, compare_password } = require('../utils/password');
const { generate_token } = require('../utils/jwt');
const { send_reset_email } = require('../configs/email');

class AuthService {
  static async register_user(user_data) {
    const { email, university_id, password, name, department, face_photo_path, id_photo_path } = user_data;

    // Check if email already exists
    const existing_user_by_email = await UserModel.find_by_email(email);
    
    // If user exists and is rejected or pending, allow update
    if (existing_user_by_email) {
      if (existing_user_by_email.status === 'rejected' || existing_user_by_email.status === 'pending') {
        // Update existing user's registration
        const password_hash = await hash_password(password);
        
        // Check if university_id matches or is available
        if (existing_user_by_email.university_id !== university_id) {
          const existing_user_by_id = await UserModel.find_by_university_id(university_id);
          if (existing_user_by_id && existing_user_by_id.id !== existing_user_by_email.id) {
            throw new Error('University ID already registered to another account');
          }
        }

        // Update user data and reset status to pending
        await UserModel.update_user(existing_user_by_email.id, {
          university_id,
          name,
          department,
          face_photo_path,
          id_photo_path
        });

        // Update password if provided
        if (password) {
          const pool = require('../configs/database').get_pool();
          await pool.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [
            password_hash,
            existing_user_by_email.id
          ]);
        }

        // Reset status to pending for resubmission
        await UserModel.update_status(existing_user_by_email.id, 'pending');

        return {
          user_id: existing_user_by_email.id,
          message: 'Registration updated and resubmitted successfully. Waiting for approval.'
        };
      } else {
        // User is approved, cannot re-register
        throw new Error('Email already registered and approved. Please log in instead.');
      }
    }

    // Check if university ID already exists (for new registrations)
    const existing_user_by_id = await UserModel.find_by_university_id(university_id);
    if (existing_user_by_id) {
      throw new Error('University ID already registered');
    }

    // Hash password
    const password_hash = await hash_password(password);

    // Create new user
    const user_id = await UserModel.create_user({
      university_id,
      name,
      email,
      password_hash,
      department,
      face_photo_path,
      id_photo_path,
      status: 'pending'
    });

    return {
      user_id,
      message: 'Registration submitted successfully. Waiting for approval.'
    };
  }

  static async login_user(email, password) {
    const user = await UserModel.find_by_email(email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const is_password_valid = await compare_password(password, user.password_hash);
    if (!is_password_valid) {
      throw new Error('Invalid email or password');
    }

    // Auto-detect user type from database
    const db_user_type = user.user_type || 'student';

    // Allow login for all users (including rejected/pending) so they can update their profile
    // Access control for buses/tickets will be handled in the respective endpoints

    // Generate token
    const token = generate_token({
      user_id: user.id,
      email: user.email,
      user_type: db_user_type,
      university_id: user.university_id
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        university_id: user.university_id,
        department: user.department,
        user_type: db_user_type
      }
    };
  }

  static async get_user_status(user_id) {
    const user = await UserModel.find_by_id(user_id);
    
    if (!user) {
      throw new Error('User not found');
    }

    return {
      status: user.status,
      user_id: user.id,
      registered_at: user.created_at
    };
  }

  static async request_password_reset(email) {
    const user = await UserModel.find_by_email(email);

    // For security, don't reveal whether the email exists.
    if (!user) {
      return { message: 'If an account with that email exists, a reset code has been sent.' };
    }

    // Generate a 6-digit numeric code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiry to 15 minutes from now
    const expires_at = new Date(Date.now() + 15 * 60 * 1000);

    await UserModel.set_reset_code(user.id, code, expires_at);

    // Send email with the code
    await send_reset_email(user.email, code);

    return {
      message: 'If an account with that email exists, a reset code has been sent.'
    };
  }

  static async reset_password(email, code, new_password) {
    const user = await UserModel.find_by_email(email);

    if (!user) {
      throw new Error('Invalid reset code or email.');
    }

    if (!user.reset_code || !user.reset_code_expires_at) {
      throw new Error('No active password reset request for this user.');
    }

    const now = new Date();
    const expires_at = new Date(user.reset_code_expires_at);

    if (user.reset_code !== code || now > expires_at) {
      throw new Error('Invalid or expired reset code.');
    }

    const password_hash = await hash_password(new_password);
    await UserModel.update_password_hash(user.id, password_hash);
    await UserModel.clear_reset_code(user.id);

    return {
      message: 'Password has been reset successfully.'
    };
  }
}

module.exports = AuthService;
