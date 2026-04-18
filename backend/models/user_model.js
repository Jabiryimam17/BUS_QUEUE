const { get_pool } = require('../configs/database');

class UserModel {
  static async create_user(user_data) {
    const pool = get_pool();
    const {
      university_id,
      name,
      email,
      password_hash,
      department,
      face_photo_path,
      id_photo_path,
      status
    } = user_data;

    const query = `
      INSERT INTO users (
        university_id, name, email, password_hash, department,
        face_photo_path, id_photo_path, status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING id
    `;

    const result = await pool.query(query, [
      university_id,
      name,
      email,
      password_hash,
      department,
      face_photo_path,
      id_photo_path,
      status || 'pending'
    ]);

    return result.rows[0]?.id;
  }

  static async find_by_email(email) {
    const pool = get_pool();
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  static async find_by_id(user_id) {
    const pool = get_pool();
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [user_id]);
    return result.rows[0] || null;
  }

  static async find_by_university_id(university_id) {
    const pool = get_pool();
    const query = 'SELECT * FROM users WHERE university_id = $1';
    const result = await pool.query(query, [university_id]);
    return result.rows[0] || null;
  }

  static async update_status(user_id, status) {
    const pool = get_pool();
    const query = 'UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2';
    const result = await pool.query(query, [status, user_id]);
    return result.rowCount > 0;
  }

  static async get_pending_registrations() {
    const pool = get_pool();
    const query = `
      SELECT id, university_id, name, email, department,
             face_photo_path, id_photo_path, status, created_at
      FROM users
      WHERE status = 'pending'
      ORDER BY created_at ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async update_user(user_id, update_data) {
    const pool = get_pool();
    const allowed_fields = ['name', 'email', 'department', 'face_photo_path', 'id_photo_path', 'university_id'];
    const updates = [];
    const values = [];

    for (const field of allowed_fields) {
      if (update_data[field] !== undefined) {
        values.push(update_data[field]);
        updates.push(`${field} = $${values.length}`);
      }
    }

    if (updates.length === 0) {
      return false;
    }

    updates.push('updated_at = NOW()');
    values.push(user_id);

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${values.length}`;
    const result = await pool.query(query, values);
    return result.rowCount > 0;
  }

  static async set_reset_code(user_id, code, expires_at) {
    const pool = get_pool();
    const query = `
      UPDATE users
      SET reset_code = $1, reset_code_expires_at = $2, updated_at = NOW()
      WHERE id = $3
    `;
    const result = await pool.query(query, [code, expires_at, user_id]);
    return result.rowCount > 0;
  }

  static async clear_reset_code(user_id) {
    const pool = get_pool();
    const query = `
      UPDATE users
      SET reset_code = NULL, reset_code_expires_at = NULL, updated_at = NOW()
      WHERE id = $1
    `;
    const result = await pool.query(query, [user_id]);
    return result.rowCount > 0;
  }

  static async update_password_hash(user_id, password_hash) {
    const pool = get_pool();
    const query = `
      UPDATE users
      SET password_hash = $1, updated_at = NOW()
      WHERE id = $2
    `;
    const result = await pool.query(query, [password_hash, user_id]);
    return result.rowCount > 0;
  }

  static async update_penalty(user_id, penalty_increment) {
    const pool = get_pool();
    const query = 'UPDATE users SET penalty = penalty + $1, updated_at = NOW() WHERE id = $2';
    const result = await pool.query(query, [penalty_increment, user_id]);
    return result.rowCount > 0;
  }

  static async get_user_with_penalty(user_id) {
    const user = await this.find_by_id(user_id);
    if (!user) {
      return null;
    }
    return {
      ...user,
      penalty: user.penalty || 0
    };
  }
}

module.exports = UserModel;
