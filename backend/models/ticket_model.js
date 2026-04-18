const { get_pool } = require('../configs/database');

class TicketModel {
  static async create_ticket(ticket_data) {
    const pool = get_pool();
    const { user_id, bus_id, display_position } = ticket_data;

    // Get the next ticket number for this bus
    const ticket_number = await this.get_next_ticket_number(bus_id);

    // Use provided display_position or default to ticket_number
    const final_display_position = display_position !== undefined ? display_position : ticket_number;

    const query = `
      INSERT INTO tickets (
        user_id, bus_id, ticket_number, status, display_position, created_at, updated_at
      ) VALUES ($1, $2, $3, 'active', $4, NOW(), NOW())
      RETURNING id
    `;

    const result = await pool.query(query, [user_id, bus_id, ticket_number, final_display_position]);
    return {
      id: result.rows[0]?.id,
      ticket_number: ticket_number
    };
  }

  static async get_next_ticket_number(bus_id) {
    const pool = get_pool();
    const query = `
      SELECT COALESCE(MAX(ticket_number), 0) + 1 as next_number
      FROM tickets
      WHERE bus_id = $1
    `;
    const result = await pool.query(query, [bus_id]);
    return result.rows[0].next_number;
  }

  static async find_by_id(ticket_id) {
    const pool = get_pool();
    const query = 'SELECT * FROM tickets WHERE id = $1';
    const result = await pool.query(query, [ticket_id]);
    return result.rows[0] || null;
  }

  static async find_by_user_and_bus(user_id, bus_id) {
    const pool = get_pool();
    const query = `
      SELECT * FROM tickets 
      WHERE user_id = $1 AND bus_id = $2 AND status = 'active'
    `;
    const result = await pool.query(query, [user_id, bus_id]);
    return result.rows[0] || null;
  }

  static async get_user_ticket(user_id) {
    const pool = get_pool();
    const query = `
      SELECT 
        t.*,
        b.route as bus_route,
        b.scheduled_time
      FROM tickets t
      INNER JOIN buses b ON t.bus_id = b.id
      WHERE t.user_id = $1 AND t.status = 'active' AND b.scheduled_time > NOW()
      ORDER BY t.created_at DESC
      LIMIT 1
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows[0] || null;
  }

  static async get_bus_queue(bus_id) {
    const pool = get_pool();
    const query = `
      SELECT 
        t.ticket_number,
        t.id as ticket_id,
        t.is_late_arrival,
        t.display_position,
        u.id as user_id,
        u.name,
        u.university_id,
        u.face_photo_path as photo,
        u.penalty
      FROM tickets t
      INNER JOIN users u ON t.user_id = u.id
      WHERE t.bus_id = $1 AND t.status = 'active'
      ORDER BY 
        CASE WHEN t.is_late_arrival = TRUE THEN 1 ELSE 0 END,
        COALESCE(t.display_position, t.ticket_number) ASC
    `;
    const result = await pool.query(query, [bus_id]);
    return result.rows;
  }

  static async mark_late_arrival(ticket_id) {
    const pool = get_pool();
    // Get max display_position for this bus
    const ticket = await this.find_by_id(ticket_id);
    if (!ticket) {
      return false;
    }

    const maxQuery = `
      SELECT COALESCE(MAX(display_position), 0) as max_pos
      FROM tickets
      WHERE bus_id = $1 AND status = 'active'
    `;
    const maxResult = await pool.query(maxQuery, [ticket.bus_id]);
    const new_position = maxResult.rows[0].max_pos + 1;

    const query = `
      UPDATE tickets 
      SET is_late_arrival = TRUE, display_position = $1, updated_at = NOW() 
      WHERE id = $2
    `;
    const result = await pool.query(query, [new_position, ticket_id]);
    return result.rowCount > 0;
  }

  static async update_display_position(ticket_id, position) {
    const pool = get_pool();
    const query = 'UPDATE tickets SET display_position = $1, updated_at = NOW() WHERE id = $2';
    const result = await pool.query(query, [position, ticket_id]);
    return result.rowCount > 0;
  }

  static async get_all_tickets_for_bus(bus_id) {
    const pool = get_pool();
    const query = `
      SELECT 
        t.*,
        u.penalty
      FROM tickets t
      INNER JOIN users u ON t.user_id = u.id
      WHERE t.bus_id = $1 AND t.status = 'active'
      ORDER BY t.ticket_number ASC
    `;
    const result = await pool.query(query, [bus_id]);
    return result.rows;
  }

  static async get_bus_ticket_count(bus_id) {
    const pool = get_pool();
    const query = `
      SELECT COUNT(*) as count
      FROM tickets
      WHERE bus_id = $1 AND status = 'active'
    `;
    const result = await pool.query(query, [bus_id]);
    return result.rows[0].count;
  }

  static async cancel_ticket(ticket_id) {
    const pool = get_pool();
    const query = "UPDATE tickets SET status = 'cancelled', updated_at = NOW() WHERE id = $1";
    const result = await pool.query(query, [ticket_id]);
    return result.rowCount > 0;
  }
}

module.exports = TicketModel;
