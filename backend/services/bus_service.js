const BusModel = require('../models/bus_model');
const TicketModel = require('../models/ticket_model');

class BusService {
  static async create_bus(bus_data) {
    const {
      route,
      scheduled_time,
      ticket_window_open,
      ticket_window_close,
      total_tickets
    } = bus_data;

    // Validate times
    if (new Date(ticket_window_open) >= new Date(ticket_window_close)) {
      throw new Error('Ticket window open time must be before close time');
    }

    if (new Date(ticket_window_close) > new Date(scheduled_time)) {
      throw new Error('Ticket window must close before or at scheduled time');
    }

    const bus_id = await BusModel.create_bus({
      route,
      scheduled_time,
      ticket_window_open,
      ticket_window_close,
      total_tickets
    });

    return {
      bus_id,
      message: 'Bus announced successfully'
    };
  }

  static async get_upcoming_buses(user_id = null) {
    const buses = await BusModel.get_upcoming_buses();
    
    // If user is authenticated, check their approval status
    if (user_id) {
      const UserModel = require('../models/user_model');
      const user = await UserModel.find_by_id(user_id);
      // If user is not approved, return empty array
      if (!user || user.status !== 'approved') {
        return [];
      }
    }
    
    // Add window status
    const now = new Date();
    return buses.map(bus => ({
      ...bus,
      is_window_open: new Date(bus.ticket_window_open) <= now && 
                      new Date(bus.ticket_window_close) >= now
    }));
  }

  static async get_all_buses() {
    return await BusModel.get_all_buses();
  }

  static async get_bus_by_id(bus_id) {
    const bus = await BusModel.find_by_id(bus_id);
    
    if (!bus) {
      throw new Error('Bus not found');
    }

    const booked_count = await TicketModel.get_bus_ticket_count(bus_id);
    
    return {
      ...bus,
      booked_tickets: booked_count,
      available_tickets: bus.total_tickets - booked_count
    };
  }

  static async update_bus(bus_id, update_data) {
    const bus_exists = await BusModel.find_by_id(bus_id);
    if (!bus_exists) {
      throw new Error('Bus not found');
    }

    const updated = await BusModel.update_bus(bus_id, update_data);
    if (!updated) {
      throw new Error('Failed to update bus');
    }

    return { message: 'Bus updated successfully' };
  }

  static async delete_bus(bus_id) {
    const bus_exists = await BusModel.find_by_id(bus_id);
    if (!bus_exists) {
      throw new Error('Bus not found');
    }

    const deleted = await BusModel.delete_bus(bus_id);
    if (!deleted) {
      throw new Error('Failed to delete bus');
    }

    return { message: 'Bus deleted successfully' };
  }
}

module.exports = BusService;
