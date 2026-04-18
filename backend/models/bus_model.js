const { get_pool } = require('../configs/database');

class BusModel {
  static async create_bus(bus_data) {
    const pool = get_pool();
    const {
      route,
      scheduled_time,
      ticket_window_open,
      ticket_window_close,
      total_tickets
    } = bus_data;

    const query = `
      INSERT INTO buses (
        route, scheduled_time, ticket_window_open,
        ticket_window_close, total_tickets, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING id
    `;

    const result = await pool.query(query, [
      route,
      scheduled_time,
      ticket_window_open,
      ticket_window_close,
      total_tickets
    ]);

    return result.rows[0]?.id;
  }

  static async find_by_id(bus_id) {
    const pool = get_pool();
    const query = 'SELECT * FROM buses WHERE id = $1';
    const result = await pool.query(query, [bus_id]);
    return result.rows[0] || null;
  }

  static async get_upcoming_buses() {
    const pool = get_pool();
    const query = `
      SELECT 
        b.*,
        COUNT(t.id) as booked_tickets,
        (b.total_tickets - COUNT(t.id)) as available_tickets
      FROM buses b
      LEFT JOIN tickets t ON b.id = t.bus_id AND t.status = 'active'
      WHERE b.scheduled_time > NOW()
      GROUP BY b.id
      ORDER BY b.scheduled_time ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async get_all_buses() {
    const pool = get_pool();
    const query = `
      SELECT 
        b.*,
        COUNT(t.id) as booked_tickets,
        (b.total_tickets - COUNT(t.id)) as available_tickets
      FROM buses b
      LEFT JOIN tickets t ON b.id = t.bus_id AND t.status = 'active'
      GROUP BY b.id
      ORDER BY b.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async update_bus(bus_id, update_data) {
    const pool = get_pool();
    const allowed_fields = ['route', 'scheduled_time', 'ticket_window_open', 'ticket_window_close', 'total_tickets'];
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
    values.push(bus_id);

    const query = `UPDATE buses SET ${updates.join(', ')} WHERE id = $${values.length}`;
    const result = await pool.query(query, values);
    return result.rowCount > 0;
  }

  static async delete_bus(bus_id) {
    const pool = get_pool();
    const query = 'DELETE FROM buses WHERE id = $1';
    const result = await pool.query(query, [bus_id]);
    return result.rowCount > 0;
  }
}

module.exports = BusModel;
