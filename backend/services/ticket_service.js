const TicketModel = require('../models/ticket_model');
const BusModel = require('../models/bus_model');
const UserModel = require('../models/user_model');
const Heap = require('heap');

class TicketService {
  static async book_ticket(user_id, bus_id) {
    // Check if user is approved
    const user = await UserModel.find_by_id(user_id);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.status !== 'approved') {
      throw new Error('Your account must be approved before booking tickets. Please wait for administrator approval.');
    }

    // Check if bus exists
    const bus = await BusModel.find_by_id(bus_id);
    if (!bus) {
      throw new Error('Bus not found');
    }

    // Check if ticket window is open
    const now = new Date();
    const window_open = new Date(bus.ticket_window_open);
    const window_close = new Date(bus.ticket_window_close);

    if (now < window_open) {
      throw new Error('Ticket window is not open yet');
    }

    if (now > window_close) {
      throw new Error('Ticket window has closed');
    }

    // Check if user already has a ticket for this bus
    const existing_ticket = await TicketModel.find_by_user_and_bus(user_id, bus_id);
    if (existing_ticket) {
      throw new Error('You already have a ticket for this bus');
    }

    // Get user's penalty
    const user_penalty = user.penalty || 0;

    // Get base position (next ticket number)
    const base_position = await TicketModel.get_next_ticket_number(bus_id);
    
    // Apply penalty
    const final_position = base_position + user_penalty;

    // Check available tickets (considering penalty might push beyond total)
    const booked_count = await TicketModel.get_bus_ticket_count(bus_id);
    if (booked_count >= bus.total_tickets) {
      throw new Error('No tickets available for this bus');
    }

    // If penalty pushes beyond total tickets, still allow but warn
    // The ticket will be created with the calculated position
    // Rearrangement will handle proper positioning

    // Create ticket with initial display_position considering penalty
    // Rearrangement will recalculate if needed
    const ticket = await TicketModel.create_ticket({
      user_id,
      bus_id,
      display_position: final_position
    });

    return {
      ticket_id: ticket.id,
      ticket_number: ticket.ticket_number,
      position: ticket.ticket_number,
      effective_position: final_position,
      message: 'Ticket booked successfully'
    };
  }

  static async get_user_ticket(user_id) {
    const ticket = await TicketModel.get_user_ticket(user_id);
    
    if (!ticket) {
      return null;
    }

    return {
      ticket_number: ticket.ticket_number,
      bus_id: ticket.bus_id,
      bus_route: ticket.bus_route,
      scheduled_time: ticket.scheduled_time,
      booked_at: ticket.created_at,
      position: ticket.ticket_number
    };
  }

  static async get_bus_queue(bus_id) {
    // Check if bus exists
    const bus = await BusModel.find_by_id(bus_id);
    if (!bus) {
      throw new Error('Bus not found');
    }

    const queue = await TicketModel.get_bus_queue(bus_id);
    return queue;
  }

  static async cancel_ticket(ticket_id, user_id) {
    const ticket = await TicketModel.find_by_id(ticket_id);
    
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    if (ticket.user_id !== user_id) {
      throw new Error('Unauthorized to cancel this ticket');
    }

    const cancelled = await TicketModel.cancel_ticket(ticket_id);
    if (!cancelled) {
      throw new Error('Failed to cancel ticket');
    }

    return { message: 'Ticket cancelled successfully' };
  }

  static async penalize_user(ticket_id, current_queue_position) {
    const ticket = await TicketModel.find_by_id(ticket_id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const n = ticket.ticket_number;
    const m = current_queue_position;

    // Calculate penalty: p = floor(m/10) - floor(n/10)
    const penalty = Math.floor(m / 10) - Math.floor(n / 10);

    if (penalty <= 0) {
      throw new Error('No penalty to apply. User arrived on time or early.');
    }

    // Add penalty to user's cumulative penalty
    const user = await UserModel.find_by_id(ticket.user_id);
    if (!user) {
      throw new Error('User not found');
    }

    await UserModel.update_penalty(ticket.user_id, penalty);

    return {
      calculated_penalty: penalty,
      new_total_penalty: (user.penalty || 0) + penalty,
      message: `Penalty of ${penalty} applied. Total penalty: ${(user.penalty || 0) + penalty}`
    };
  }

  static async mark_late_arrival(ticket_id) {
    const ticket = await TicketModel.find_by_id(ticket_id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const marked = await TicketModel.mark_late_arrival(ticket_id);
    if (!marked) {
      throw new Error('Failed to mark as late arrival');
    }

    return { message: 'Ticket marked as late arrival. Student must board at the end.' };
  }

  static async rearrange_queue(bus_id) {
    // Get all tickets for this bus with user penalties, ordered by ticket_number
    const tickets = await TicketModel.get_all_tickets_for_bus(bus_id);
    
    if (tickets.length === 0) {
      return { message: 'No tickets to rearrange', queue: [] };
    }

    const n = tickets.length;

    // Min-heap by effective position, then by original index
    const pq = new Heap((a, b) => {
      if (a.effective_pos !== b.effective_pos) {
        return a.effective_pos - b.effective_pos;
      }
      return a.original_index - b.original_index;
    });

    let q = 1; // display position (1-based)
    const orders = []; // Array to store {ticket_id, display_position}

    // Process tickets in order of ticket_number
    for (let i = 0; i < n; i++) {
      const ticket = tickets[i];

      // Place users whose effective position is ready
      while (!pq.empty() && pq.peek().effective_pos <= q) {
        const user = pq.pop();
        orders.push({
          ticket_id: user.ticket_id,
          display_position: q++
        });
      }

      // Calculate effective position using the algorithm from order_users.js
      // For late arrivals, use effective position 2*n so they flush out later
      let effective_pos;
      if (ticket.is_late_arrival) {
        // Late arrivals get pushed to end with effective position 2*n
        effective_pos = 2 * n;
      } else {
        // Core algorithm: effective_pos = (i + 1) + penalty - pq.size()
        effective_pos = (i + 1) + (ticket.penalty || 0) - pq.size();
      }

      pq.push({
        ticket_id: ticket.id,
        effective_pos: effective_pos,
        original_index: i
      });
    }

    // Flush remaining users from priority queue
    while (!pq.empty()) {
      const user = pq.pop();
      orders.push({
        ticket_id: user.ticket_id,
        display_position: q++
      });
    }

    // Update display_position for each ticket
    for (const order of orders) {
      await TicketModel.update_display_position(order.ticket_id, order.display_position);
    }

    // Get updated queue
    const rearranged_queue = await TicketModel.get_bus_queue(bus_id);

    return {
      message: 'Queue rearranged successfully',
      queue: rearranged_queue
    };
  }
}

module.exports = TicketService;
