const UserModel = require('../models/user_model');

class UserService {
  static async get_pending_registrations() {
    return await UserModel.get_pending_registrations();
  }

  static async approve_registration(registration_id) {
    const user = await UserModel.find_by_id(registration_id);
    
    if (!user) {
      throw new Error('Registration not found');
    }

    if (user.status !== 'pending') {
      throw new Error('Registration is not pending');
    }

    const updated = await UserModel.update_status(registration_id, 'approved');
    if (!updated) {
      throw new Error('Failed to approve registration');
    }

    return { message: 'Registration approved successfully' };
  }

  static async reject_registration(registration_id) {
    const user = await UserModel.find_by_id(registration_id);
    
    if (!user) {
      throw new Error('Registration not found');
    }

    if (user.status !== 'pending') {
      throw new Error('Registration is not pending');
    }

    const updated = await UserModel.update_status(registration_id, 'rejected');
    if (!updated) {
      throw new Error('Failed to reject registration');
    }

    return { message: 'Registration rejected successfully' };
  }

  static async get_user_by_id(user_id) {
    const user = await UserModel.find_by_id(user_id);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Remove sensitive data
    const { password_hash, ...user_data } = user;
    return user_data;
  }

  static async update_profile(user_id, update_data) {
    const user = await UserModel.find_by_id(user_id);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Only allow updates if status is rejected or pending
    if (user.status === 'approved') {
      throw new Error('Cannot update profile after approval. Contact administrator for changes.');
    }

    // Check university_id uniqueness if it's being updated
    if (update_data.university_id && update_data.university_id !== user.university_id) {
      const existing_user = await UserModel.find_by_university_id(update_data.university_id);
      if (existing_user && existing_user.id !== user_id) {
        throw new Error('University ID already registered to another account');
      }
    }

    // Reset status to pending after update
    const updated = await UserModel.update_user(user_id, update_data);
    if (!updated) {
      throw new Error('Failed to update profile');
    }

    // Reset status to pending for resubmission
    await UserModel.update_status(user_id, 'pending');

    return { message: 'Profile updated successfully. Status reset to pending for review.' };
  }

  static async get_my_profile(user_id) {
    const user = await UserModel.find_by_id(user_id);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Remove sensitive data
    const { password_hash, ...user_data } = user;
    return user_data;
  }
}

module.exports = UserService;
